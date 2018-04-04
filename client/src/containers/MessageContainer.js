import React from "react";

import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";
import styled from "styled-components";
import FileUpload from "../components/FileUpload";

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype

      created_at
    }
  }
`;

const Image = styled.img`
  width: 75%;
`;

const Message = ({ message: m }) =>
  m.url ? (
    <Image styles={styles.image} src={m.url} alt="" />
  ) : (
    <Comment.Text>{m.text}</Comment.Text>
  );

const styles = {
  FileUpload: {
    gridColumn: 3,
    gridRow: 2,
    paddingLeft: "20px",
    paddingRight: "20px",
    display: "flex",
    overflowY: "auto",
    flexDirection: "column reverse"
  }
};

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

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage]
        };
      }
    });

  render() {
    const { data: { loading, messages } } = this.props;

    if (loading) {
      return null;
    }

    return (
      <FileUpload
        style={styles.FileUpload}
        disableClick
        channelId={this.props.channelId}
      >
        <Comment.Group>
          {messages.map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author>{m.user.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Message message={m} />
                {/* {m.url ? (
                  <img styles={styles.image} src={m.url} alt="" />
                ) : (
                  <Comment.Text>{m.text}</Comment.Text>
                )} */}
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </FileUpload>
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
      url
      filetype
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  options: props => ({
    fetchPolicy: "network-only",
    variables: {
      channelId: props.channelId
    }
  })
})(MessageContainer);
