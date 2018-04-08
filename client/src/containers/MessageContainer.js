import React from "react";

import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Comment, Button } from "semantic-ui-react";
import styled from "styled-components";
import FileUpload from "../components/FileUpload";
import RenderText from "../components/RenderText";

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

const Message = ({ message: { text, url, filetype } }) => {
  if (url) {
    if (filetype.startsWith("image/")) {
      return <Image src={url} alt="" />;
    } else if (filetype.startsWith("text")) {
      return <RenderText url={url} />;
    } else if (filetype.startsWith("audio/")) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }

  return <Comment.Text>{text}</Comment.Text>;
};

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
  state = {
    hasMoreItems: true
  };
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
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages]
        };
      }
    });

  render() {
    const { data: { loading, messages }, channelId } = this.props;

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
          {this.state.hasMoreItems &&
            messages.length >= 35 && (
              <Button
                onClick={() => {
                  this.props.data.fetchMore({
                    variables: {
                      channelId,
                      cursor: messages[messages.length - 1].created_at
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      if (!fetchMoreResult) {
                        return previousResult;
                      }

                      if (fetchMoreResult.messages.length < 35) {
                        this.setState(() => ({ hasMoreItems: false }));
                      }

                      return {
                        ...previousResult,
                        messages: [
                          ...previousResult.messages,
                          ...fetchMoreResult.messages
                        ]
                      };
                    }
                  });
                }}
              >
                Load More
              </Button>
            )}
          {[...messages].reverse().map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author>{m.user.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.created_at}</div>
                </Comment.Metadata>
                <Message message={m} />
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </FileUpload>
    );
  }
}

const messagesQuery = gql`
  query($cursor: String, $channelId: Int!) {
    messages(cursor: $cursor, channelId: $channelId) {
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
