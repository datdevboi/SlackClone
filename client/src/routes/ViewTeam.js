import React from "react";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import Header from "../components/Header";
import Messages from "../components/Messages";
import Input from "../components/Input";
import AppLayout from "../components/AppLayout";

export default () => (
  <AppLayout>
    <Teams class="teams">Teams</Teams>
    <Channels>Channels</Channels>
    <Header>Header</Header>
    <Messages>
      <ul class="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <div class="input">
      <input type="text" placeholder="CSS Grid Layout Module" />
    </div>
  </AppLayout>
);
