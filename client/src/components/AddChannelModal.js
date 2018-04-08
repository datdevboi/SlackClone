import React from "react";
import { Form, Modal, Button, Input, Checkbox } from "semantic-ui-react";
import { withFormik } from "formik";
import { compose, graphql } from "react-apollo";
// import { allTeamsQuery } from "../graphql/team";
import { gql } from "apollo-boost";
import findIndex from "lodash/findIndex";
import MultiSelectUsers from "./MultiSelectUsers";

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
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
  currentUserId
}) => (
  <Modal
    open={open}
    onClose={e => {
      resetForm();
      onClose(e);
    }}
    style={center}
  >
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
        <Form.Field>
          <Checkbox
            label="Private"
            onChange={(e, { checked }) => {
              setFieldValue("public", !checked);
            }}
            toggle
          />
        </Form.Field>

        {values.public ? null : (
          <Form.Field>
            <MultiSelectUsers
              value={values.members}
              teamId={teamId}
              placeholder={"Add Friend"}
              currentUserId={currentUserId}
              handleChange={(e, { value }) => setFieldValue("members", value)}
            />
          </Form.Field>
        )}
        <Form.Group width="equal">
          <Button fluid primary disabled={isSubmitting} onClick={handleSubmit}>
            Create Channel
          </Button>
          <Button
            fluid
            color="red"
            onClose={e => {
              resetForm();
              onClose(e);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(
      teamId: $teamId
      name: $name
      public: $public
      members: $members
    ) {
      ok
      channel {
        id
        name
        dm
      }
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
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ public: true, name: "", members: [] }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      await mutate({
        variables: {
          teamId,
          name: values.name,
          members: values.members,
          public: values.public
        },
        optimisticResponse: {
          createChannel: {
            __typename: "Mutation",
            ok: true,
            channel: {
              __typename: "Channel",
              id: -1,
              name: values.name,
              dm: false
            }
          }
        },
        update: (proxy, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }
          const data = proxy.readQuery({ query: meQuery });

          const teamIdx = findIndex(data.me.teams, ["id", teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          proxy.writeQuery({ query: meQuery, data });
        }
      });
      onClose();
      setSubmitting(false);
    }
  })
)(AddChannelModal);
