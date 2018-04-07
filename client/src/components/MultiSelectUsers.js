import React from "react";
import { graphql } from "react-apollo";
import { Dropdown } from "semantic-ui-react";
import { gql } from "apollo-boost";

const MultiSelectUsers = ({
  data: { loading, getTeamMembers },
  value,
  handleChange,
  placeholder,
  currentUserId
}) =>
  loading ? null : (
    <Dropdown
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      fluid
      multiple
      search
      selection
      options={getTeamMembers.filter(x => x.id !== currentUserId).map(tm => ({
        key: tm.id,
        value: tm.id,
        text: tm.username
      }))}
    />
  );

const getTeamMembersQuery = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;

export default graphql(getTeamMembersQuery, {
  options: props => ({
    variables: {
      teamId: props.teamId
    }
  })
})(MultiSelectUsers);
