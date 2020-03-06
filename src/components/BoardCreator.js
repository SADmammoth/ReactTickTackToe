import React from "react";
import propTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Form from "./Form";

class BoardCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentDidMount() {
    this.setState({ open: this.props.open });
  }

  hide() {
    this.setState({ open: false });
  }

  render() {
    return (
      <Modal show={open}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              inputs={this.props.inputs}
              onSubmit={data => (this.hide(), this.props.onSubmit(data))}
              submitButton={<Button>Create</Button>}
            />
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
    );
  }
}

BoardCreator.propTypes = {
  id: propTypes.string,
  open: propTypes.bool,
  inputs: Form.propTypes.inputs,
  onSubmit: Form.propTypes.onSubmit
};

export default BoardCreator;
