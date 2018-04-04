import React from "react";
import { Form, Modal, Button, Input } from "semantic-ui-react";
import Downshift from "downshift";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

const center = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%)`
};
const DirectMessageModal = ({
  history,
  open,
  onClose,
  teamId,
  data: { loading, getTeamMembers }
}) => (
  <Modal open={open} onClose={onClose} style={center}>
    <Modal.Header>Message User</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          {!loading && (
            <Downshift
              onChange={selectedUser => {
                history.push(`/view-team/user/${teamId}/${selectedUser.id}`);
                onClose();
              }}
              render={({
                getInputProps,
                getItemProps,
                isOpen,
                inputValue,
                selectedItem,
                highlightedIndex
              }) => (
                <div>
                  <Input
                    fluid
                    icon="search"
                    {...getInputProps({ placeholder: "Look up user.." })}
                  />
                  {isOpen ? (
                    <div style={{ border: "1px solid #ccc" }}>
                      {getTeamMembers
                        .filter(
                          i =>
                            !inputValue ||
                            i.username
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                        .map((item, index) => (
                          <div
                            {...getItemProps({ item })}
                            key={item.id}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ? "gray" : "white",
                              fontWeight:
                                selectedItem === item ? "bold" : "normal"
                            }}
                          >
                            {item.username}
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              )}
            />
          )}
        </Form.Field>

        <Button fluid color="red" onClick={onClose}>
          Cancel
        </Button>
      </Form>
    </Modal.Content>
  </Modal>
);

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
