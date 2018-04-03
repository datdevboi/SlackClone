import React from "react";
import Dropzone from "react-dropzone";

const FileUpload = ({ children, disableClick }) => (
  <Dropzone
    onDrop={() => {
      console.log("filed dropped");
    }}
    className="ignore"
    disableClick={disableClick}
  >
    {children}
  </Dropzone>
);

export default FileUpload;
