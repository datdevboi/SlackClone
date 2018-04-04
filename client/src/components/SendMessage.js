import React from "react";
import styled from "styled-components";
import { Input, Button, Icon } from "semantic-ui-react";
import { withFormik } from "formik";

import FileUpload from "./FileUpload";

const Message = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 15px;
  display: flex;
  flex-direction: row;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  channelId
}) => (
  <Message>
    <FileUpload channelId={channelId}>
      <Button icon>
        <Icon name="plus" />
      </Button>
    </FileUpload>
    <Input
      style={{ flexGrow: 1 }}
      name="message"
      value={values.message}
      onKeyDown={e => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={`Message #${placeholder}`}
    />
  </Message>
);

export default withFormik({
  mapPropsToValues: () => ({ message: "" }),
  handleSubmit: async (
    values,
    { props: { onSubmit }, resetForm, setSubmitting }
  ) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }

    await onSubmit(values);

    resetForm(false);
  }
})(SendMessage);
