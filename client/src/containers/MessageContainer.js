import React from "react";
import Messages from "../components/Messages";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;
class MessageContainer extends React.Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId => {
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log(subscriptionData);

        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage]
        };
      }
    });
  };

  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return null;
    }

    return (
      <Messages>
        <Comment.Group>
          {messages.map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author>{m.user.username}</Comment.Author>
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

const messagesQuery = gql`
  query($channelId: Int!) {
    messages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId
  }),
  options: {
    fetchPolicy: "network-only"
  }
})(MessageContainer);
