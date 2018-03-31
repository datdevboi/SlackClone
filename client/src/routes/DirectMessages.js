import React from "react";
import { graphql, compose } from "react-apollo";
import { gql } from "apollo-boost";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import MessageContainer from "../containers/MessageContainer";
import findIndex from "lodash/findIndex";

const ViewTeam = ({
  mutate,
  data: { loading, me },
  match: { params: { teamId, channelId } }
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
      {/* <Header channelName={channel.name} />
      <MessageContainer channelId={channel.id} /> */}

      <SendMessage onSubmit={values => {}} placeholder={username} />
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

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  graphql(meQuery, {
    options: {
      fetchPolicy: "network-only"
    }
  })
)(ViewTeam);
