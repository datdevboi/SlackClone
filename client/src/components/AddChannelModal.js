import React, { Component } from "react";
import { Form, Modal, Button, Header, Image, Input } from "semantic-ui-react";

const center = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%)`
};
const AddChannelModal = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} style={center}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input fluid icon="add" placeholder="Channel Name" />
        </Form.Field>
        <Form.Group width="equal">
          <Button fluid primary>
            Create Channel
          </Button>
          <Button fluid color="red">
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddChannelModal;
