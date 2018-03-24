import React, { Component } from "react";
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
    const { teams, team } = this.props;

    let userName = "";

    try {
      const token = localStorage.getItem("token");
      const { user } = decode(token);
      userName = user.username;
    } catch (error) {}

    return (
      <React.Fragment>
        <Teams teams={teams} />
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

export default SideBar;
