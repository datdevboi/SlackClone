import React from "react";

import { gql } from "apollo-boost";
import { graphql } from "react-apollo";
import { Comment } from "semantic-ui-react";
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
    flexDirection: "column-reverse",

    overflowY: "auto"
  }
};

class MessageContainer extends React.Component {
  state = {
    hasMoreItems: true
  };
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ channelId, data: { messages } }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }

    if (
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.props.data.messsages &&
      messages &&
      this.props.data.messages.length !== messages.length
    ) {
      const heightBeforeRender = this.scroller.scrollHeight;
      setTimeout(() => {
        this.scroller.scrollTop =
          this.scroller.scrollHeight - heightBeforeRender;
      }, 100);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleScroll = e => {
    const { data: { messages, fetchMore }, channelId } = this.props;
    if (
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.state.hasMoreItems &&
      messages.length >= 35
    ) {
      fetchMore({
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
            messages: [...previousResult.messages, ...fetchMoreResult.messages]
          };
        }
      });

      console.log("fetchedMored");
    }
  };

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
      <div
        style={styles.FileUpload}
        onScroll={this.handleScroll}
        ref={scroller => {
          this.scroller = scroller;
        }}
      >
        <FileUpload
          disableClick
          channelId={channelId}
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          <Comment.Group>
            {[...messages].reverse().map(m => (
              <Comment key={`${m.id}-${m.created_at}-message`}>
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
      </div>
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
