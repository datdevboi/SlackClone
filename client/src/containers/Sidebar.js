import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import _ from "lodash";
import decode from "jwt-decode";
import Channels from "../components/Channels";
import Teams from "../components/Teams";

const SideBar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) {
    return null;
  }

  const teamIdx = _.findIndex(allTeams, ["id", currentTeamId]);
  const team = allTeams[teamIdx];
  let userName = "";

  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    userName = user.username;
  } catch (error) {}

  return (
    <React.Fragment>
      <Teams
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
      />
      <Channels
        teamName={team.name}
        username={userName}
        channels={team.channels}
        users={[{ id: 1, name: "slackbox" }, { id: 2, name: "user1" }]}
      >
        Channels
      </Channels>
    </React.Fragment>
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

export default graphql(allTeamsQuery)(SideBar);
