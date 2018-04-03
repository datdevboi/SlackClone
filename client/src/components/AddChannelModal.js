import React from "react";
import { Form, Modal, Button, Input } from "semantic-ui-react";
import { withFormik } from "formik";
import { compose, graphql } from "react-apollo";
// import { allTeamsQuery } from "../graphql/team";
import { gql } from "apollo-boost";
import findIndex from "lodash/findIndex";

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
  resetForm
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
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
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
        }
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: "" }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting }
    ) => {
      await mutate({
        variables: {
          teamId,
          name: values.name
        },
        optimisticResponse: {
          createChannel: {
            __typename: "Mutation",
            ok: true,
            channel: {
              __typename: "Channel",
              id: -1,
              name: values.name
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
