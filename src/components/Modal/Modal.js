import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Lists from "../Lists/Lists";
import InputBar from "../InputBar/InputBar";
const axios = require('axios');

class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.clicked,
            nestedModal: false,
            closeAll: false,
            input: "",
            children: this.props.data.children
        };
        this.onToggle = this.onToggle.bind(this);
        this.onToggleNested = this.onToggleNested.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }
    onToggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
        // location.reload(true);
    }
    onToggleNested() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false
        });
    }
    onAdd() {
        var { children } = this.state;
        // const id = children.length ? children[children.length - 1].id + 1 : 1;
        // // let children = this.state.children;

        axios.post('http://35.154.175.45/project/add-child', {
            child: {
                key: this.state.input
            },
            parentId: this.props.data._id
        })
            .then(response => {
                const obj = {
                    _id: response.data._id,
                    name: this.state.input
                };
                children.push(obj);
                this.setState(children);
            })
            .catch(err => console.log(err))
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false,
            children: children
        });
    }
    onDelete() {
        let { children, input } = this.state;
        let obj = children.filter(function (child) {
            return child._id !== parseInt(input);
        })
        console.log(obj);
        axios.post('http://35.154.175.45/project/delete-child', {
            childId: input,
            parentId: this.props.data._id
        }).catch(err => console.log(err))
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: false,
            children: obj
        });
    }
    toggleAll() {
        this.setState({
            nestedModal: !this.state.nestedModal,
            closeAll: true
        });
    }
    onInputChange(event) {
        this.setState({ input: event.target.value });
    }
    render() {

        return (
            <div>
                <Button color="danger" onClick={this.onToggle}>{this.props.buttonLabel}</Button>
                <Modal isOpen={this.state.modal} onToggle={this.onToggle} className={this.props.className}>
                    <ModalHeader onToggle={this.onToggle}>{this.props.data.name}</ModalHeader>
                    <ModalBody>
                        <Lists children={this.state.children} onDelete={this.onDelete} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onToggleNested}>Modify</Button>{" "}
                        <Modal isOpen={this.state.nestedModal} toggle={this.onToggleNested}
                            onClosed={
                                this.state.closeAll ? this.onToggle : undefined
                            }>
                            <ModalHeader>Add/Delete Child</ModalHeader>
                            <ModalBody>
                                <InputBar placeholder="Enter Question(Index) to Add(Delete)....." onInputChange={this.onInputChange} />
                            </ModalBody>
                            <ModalFooter>
                                <Button outline color="success" onClick={this.onAdd}>Add</Button>{" "}
                                <Button outline color="danger" onClick={this.onDelete}>Delete</Button>{" "}
                                <Button outline color="secondary" onClick={this.toggleAll}>All Done</Button>
                            </ModalFooter>
                        </Modal>
                        <Button color="secondary" onClick={this.onToggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Popup;
