import React from "react";
import Dropzone from "react-dropzone";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

const FileUpload = ({
  children,
  disableClick,
  mutate,
  channelId,
  style = {}
}) => (
  <Dropzone
    onDrop={async ([file]) => {
      const response = await mutate({
        variables: {
          channelId,
          file
        }
      });
    }}
    className="ignore"
    style={style}
    disableClick={disableClick}
  >
    {children}
  </Dropzone>
);

const createFileMessageMutation = gql`
  mutation($channelId: Int!, $file: File) {
    createMessage(channelId: $channelId, file: $file)
  }
`;

export default graphql(createFileMessageMutation)(FileUpload);
