import React from "react";
import { graphql, compose } from "react-apollo";
import { gql } from "apollo-boost";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import findIndex from "lodash/findIndex";

const DirectMessages = ({
  mutate,
  data: { loading, me },
  match: { params: { teamId, userId } }
}) => {
  if (loading) {
    return null;
  }

  const { teams, username } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);

  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team}
        userName={username}
      />
      <Header channelName={"Someone's username"} />
      <DirectMessageContainer teamId={team.id} userId={userId} />

      <SendMessage
        onSubmit={async values => {
          await mutate({
            variables: {
              text: values.message,
              receiverId: userId,
              teamId: team.id
            }
          });
        }}
        placeholder={username}
      />
    </AppLayout>
  );
};

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

const createDirectMessageMutation = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(createDirectMessageMutation),
  graphql(meQuery, {
    options: {
      fetchPolicy: "network-only"
    }
  })
)(DirectMessages);
