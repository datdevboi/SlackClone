import React from "react";
import { Form, Modal, Button } from "semantic-ui-react";
import { gql } from "apollo-boost";
import { graphql, compose } from "react-apollo";
import { withRouter } from "react-router-dom";
import MultiSelectUsers from "./MultiSelectUsers";
import { withFormik } from "formik";
import findIndex from "lodash/findIndex";

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
    <Modal.Header>Direct Messaging</Modal.Header>
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
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
    }
  }
`;

const meQuery = gql`
  {
    me {
      id
      username

      teams {
        id
        name
        admin
        channels {
          id
          name
          dm
        }
      }
    }
  }
`;

export default compose(
  withRouter,
  graphql(getOrCreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ members: [] }),
    handleSubmit: async (
      values,
      { props: { history, onClose, teamId, mutate }, resetForm, setSubmitting }
    ) => {
      const response = await mutate({
        variables: {
          teamId,
          members: values.members
        },
        update: (proxy, { data: { getOrCreateChannel } }) => {
          const { id, name } = getOrCreateChannel;

          const data = proxy.readQuery({ query: meQuery });

          const teamIdx = findIndex(data.me.teams, ["id", teamId]);
          const notInChannelList = data.me.teams[teamIdx].channels.every(
            ch => ch.id !== id
          );

          if (notInChannelList) {
            data.me.teams[teamIdx].channels.push({
              __typename: "Channel",
              id,
              name,
              dm: true
            });

            proxy.writeQuery({ query: meQuery, data });
          }
        }
      });

      onClose();
      resetForm();
      history.push(
        `/view-team/${teamId}/${response.data.getOrCreateChannel.id}`
      );
    }
  })
)(DirectMessageModal);
