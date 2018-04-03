import React from "react";
import Dropzone from "react-dropzone";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

const FileUpload = ({ children, disableClick, mutate, channelId }) => (
  <Dropzone
    onDrop={async ([file]) => {
      const response = await mutate({
        variables: {
          channelId,
          file
        }
      });

      console.log(response);
    }}
    className="ignore"
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
