import React, { Component } from "react";
import decode from "jwt-decode";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
// import { allTeamsQuery } from "../graphql/team";

class SideBar extends Component {
  state = {
    opendAddChannelModal: false,
    openInvitePeopleModal: false
  };

  toogleAddChannelModal = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState(prevState => ({
      opendAddChannelModal: !prevState.opendAddChannelModal
    }));
  };

  toogleInvitePeopleModal = e => {
    if (e) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      openInvitePeopleModal: !prevState.openInvitePeopleModal
    }));
  };

  render() {
    const { teams, team } = this.props;

    let userName = "";
    let isOwner = true;

    try {
      const token = localStorage.getItem("token");
      const { user } = decode(token);
      userName = user.username;
      isOwner = user.id === team.owner;
    } catch (error) {}

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={userName}
          channels={team.channels}
          teamId={team.id}
          isOwner={isOwner}
          users={[{ id: 1, name: "slackbox" }, { id: 2, name: "user1" }]}
          onAddChannelClick={this.toogleAddChannelModal}
          onInvitePeopleClick={this.toogleInvitePeopleModal}
        />

        <AddChannelModal
          teamId={team.id}
          open={this.state.opendAddChannelModal}
          onClose={this.toogleAddChannelModal}
        />

        <InvitePeopleModal
          teamId={team.id}
          open={this.state.openInvitePeopleModal}
          onClose={this.toogleInvitePeopleModal}
        />
      </React.Fragment>
    );
  }
}

export default SideBar;
