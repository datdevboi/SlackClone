import React, { Component } from "react";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import DirectMessageModal from "../components/DirectMessageModal";
// import { allTeamsQuery } from "../graphql/team";

class SideBar extends Component {
  state = {
    opendAddChannelModal: false,
    openInvitePeopleModal: false,
    openDirectMessageModal: false
  };

  toogleDirectMessageModal = e => {
    if (e) {
      e.preventDefault();
    }

    this.setState(prevState => ({
      openDirectMessageModal: !prevState.openDirectMessageModal
    }));
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
    const { teams, team, username } = this.props;
    const { openDirectMessageModal } = this.state;

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          channels={team.channels}
          teamId={team.id}
          isOwner={team.admin}
          users={[{ id: 1, name: "slackbox" }, { id: 2, name: "user1" }]}
          onAddChannelClick={this.toogleAddChannelModal}
          onInvitePeopleClick={this.toogleInvitePeopleModal}
          onDirectMessageClick={this.toogleDirectMessageModal}
        />
        <DirectMessageModal
          teamId={team.id}
          open={openDirectMessageModal}
          onClose={this.toogleDirectMessageModal}
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
