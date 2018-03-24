import React, { Component } from "react";
import { Form, Modal, Button, Header, Image, Input } from "semantic-ui-react";
import { withFormik } from "formik";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

const center = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%)`
};
const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Modal open={open} onClose={onClose} style={center}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            icon="add"
            placeholder="Channel Name"
          />
        </Form.Field>
        <Form.Group width="equal">
          <Button fluid primary disabled={isSubmitting} onClick={handleSubmit}>
            Create Channel
          </Button>
          <Button fluid color="red" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

export default withFormik({
  mapPropsToValues: () => ({ name: "" }),
  // Add a custom validation function (this can be async too!)

  // Submission handler
  handleSubmit: (values, { props, setSubmitting }) => {
    console.log("cool cool cool");
    setSubmitting(false);
  }
})(AddChannelModal);
