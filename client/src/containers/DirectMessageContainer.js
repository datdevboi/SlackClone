import React from "react";
import Messages from "../components/Messages";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

class DirectMessageContainer extends React.Component {
  //   componentWillMount() {
  //     this.unsubscribe = this.subscribe(this.props.channelId);
  //   }

  //   componentWillReceiveProps({ channelId }) {
  //     if (this.props.channelId !== channelId) {
  //       if (this.unsubscribe) {
  //         this.unsubscribe();
  //       }
  //       this.unsubscribe = this.subscribe(channelId);
  //     }
  //   }

  //   componentWillUnmount() {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //   }

  //   subscribe = channelId => {
  //     this.props.data.subscribeToMore({
  //       document: newChannelMessageSubscription,
  //       variables: {
  //         channelId
  //       },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData) {
  //           return prev;
  //         }
  //         console.log(subscriptionData);

  //         return {
  //           ...prev,
  //           messages: [...prev.messages, subscriptionData.data.newChannelMessage]
  //         };
  //       }
  //     });
  //   };

  render() {
    const { data: { loading, directMessages } } = this.props;
    console.log(directMessages);

    if (loading) {
      return null;
    }

    return (
      <Messages>
        <Comment.Group>
          {directMessages.map(m => (
            <Comment key={`${m.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author>{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    );
  }
}

const directMessagesQuery = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    userId: props.userId
  }),
  options: {
    fetchPolicy: "network-only"
  }
})(DirectMessageContainer);
