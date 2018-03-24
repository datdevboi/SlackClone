import React, { Component } from "react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import findIndex from "lodash/findIndex";
import decode from "jwt-decode";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
// import { allTeamsQuery } from "../graphql/team";

class SideBar extends Component {
  state = {
    opendAddChannelModal: false
  };

  handleAddChannelClick = () => {
    this.setState(() => ({
      opendAddChannelModal: true
    }));
  };

  handleCloseAddChannelModal = () => {
    this.setState(() => ({
      opendAddChannelModal: false
    }));
  };

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;

    if (loading) {
      return null;
    }

    const teamIdx = currentTeamId
      ? findIndex(allTeams, ["id", parseInt(currentTeamId, 10)])
      : 0;
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
          teamId={team.id}
          users={[{ id: 1, name: "slackbox" }, { id: 2, name: "user1" }]}
          onAddChannelClick={this.handleAddChannelClick}
        />

        <AddChannelModal
          teamId={team.id}
          open={this.state.opendAddChannelModal}
          onClose={this.handleCloseAddChannelModal}
        />
      </React.Fragment>
    );
  }
}

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
