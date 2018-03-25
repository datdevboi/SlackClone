import React from "react";
import { Form, Modal, Button, Input } from "semantic-ui-react";
import { withFormik } from "formik";
import { compose, graphql } from "react-apollo";
// import { allTeamsQuery } from "../graphql/team";
import { gql } from "apollo-boost";

const center = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%)`
};
const InvitePeopleModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Modal open={open} onClose={onClose} style={center}>
    <Modal.Header>Add People to your Team</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fluid
            icon="add"
            placeholder="User's email..."
          />
        </Form.Field>
        <Form.Group width="equal">
          <Button fluid primary disabled={isSubmitting} onClick={handleSubmit}>
            Add User
          </Button>
          <Button fluid color="red" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: "" }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          email: values.email
        }
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    }
  })
)(InvitePeopleModal);
