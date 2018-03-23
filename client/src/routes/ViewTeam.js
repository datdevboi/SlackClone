import React from "react";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import Header from "../components/Header";
import Messages from "../components/Messages";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";

export default () => (
  <AppLayout>
    <Teams teams={[{ id: 1, name: "T" }, { id: 2, name: "Q" }]} />
    <Channels
      teamName="Team name"
      username="Username"
      channels={[{ id: 1, name: "general" }, { id: 2, name: "random" }]}
      users={[{ id: 1, name: "slackbox" }, { id: 2, name: "user1" }]}
    >
      Channels
    </Channels>
    <Header channelName="general" />
    <Messages>
      <ul class="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName={"T"} />
  </AppLayout>
);
