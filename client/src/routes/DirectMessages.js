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

const directMessageMeQuery = gql`
  query($userId: Int!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username

      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
          dm
        }
      }
    }
  }
`;

const meQuery = gql`
  {
    me {
      id
      username

      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;
const ViewTeam = ({
  mutate,
  data: { loading, me, getUser },
  match: { params: { teamId, userId } }
}) => {
  if (loading) {
    return null;
  }
  console.log(me);
  console.log(getUser);
  const { teams, username } = me;

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);

  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  console.log(team);
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
      <Header channelName={getUser.username} />
      <DirectMessageContainer teamId={team.id} userId={userId} />

      <SendMessage
        onSubmit={async values => {
          await mutate({
            variables: {
              text: values.message,
              receiverId: userId,
              teamId
            },
            optimisticResponse: {
              createDirectMessage: true
            },
            update: proxy => {
              const data = proxy.readQuery({ query: meQuery });

              const teamIdx2 = findIndex(data.me.teams, ["id", team.id]);
              const notAlreadyThere = data.me.teams[
                teamIdx2
              ].directMessageMembers.every(
                member => member.id !== parseInt(userId, 10)
              );

              if (notAlreadyThere) {
                data.me.teams[teamIdx2].directMessageMembers.push({
                  __typename: "User",
                  id: userId,
                  username: getUser.username
                });
                proxy.writeQuery({ query: meQuery, data });
              }
            }
          });
        }}
        placeholder={username}
      />
    </AppLayout>
  );
};

const createDirectMessage = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export default compose(
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: {
        userId: props.match.params.userId
      },
      fetchPolicy: "network-only"
    })
  }),
  graphql(createDirectMessage)
)(ViewTeam);
