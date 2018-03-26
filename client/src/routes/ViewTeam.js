import React from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import { Redirect } from "react-router-dom";
import Header from "../components/Header";
import Messages from "../components/Messages";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Sidebar from "../containers/Sidebar";
import findIndex from "lodash/findIndex";

const ViewTeam = ({
  data: { loading, allTeams },
  match: { params: { teamId, channelId } }
}) => {
  if (loading) {
    return null;
  }

  if (!allTeams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);

  const teamIdx = teamIdInteger
    ? findIndex(allTeams, ["id", teamIdInteger])
    : 0;
  const team = allTeams[teamIdx];

  const channelIdInteger = parseInt(channelId, 10);

  const channelIdx = channelIdInteger
    ? findIndex(team.channels, ["id", channelIdInteger])
    : 0;
  const channel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team}
      />
      <Header channelName={channel.name} />
      <Messages channelId={channel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={channel.name} />
    </AppLayout>
  );
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(ViewTeam);
