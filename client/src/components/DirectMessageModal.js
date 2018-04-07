import React from "react";
import { Form, Modal, Button } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import MultiSelectUsers from "./MultiSelectUsers";
import { withFormik } from "formik";

const center = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%)`
};
const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  currentUserId,
  values,

  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue
}) => (
  <Modal open={open} onClose={onClose} style={center}>
    <Modal.Header>Message User</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <MultiSelectUsers
            value={values.members}
            teamId={teamId}
            placeholder={"Select members to message"}
            currentUserId={currentUserId}
            handleChange={(e, { value }) => setFieldValue("members", value)}
          />
        </Form.Field>
        <Form.Group>
          <Button
            disabled={isSubmitting}
            fluid
            color="red"
            onClick={e => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} fluid primary onClick={handleSubmit}>
            Start Messaging
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const getOrCreateChannelMutation = gql`
  mutation($teamId: Int!, $members: [Int!]) {
    getOrCreateChannel(teamId: $teamId, members: $members)
  }
`;

export default compose(
  withRouter,
  graphql(getOrCreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          members: values.members
        }
      });
      console.log(response);
      onClose();
      setSubmitting(false);
    }
  })
)(DirectMessageModal);
