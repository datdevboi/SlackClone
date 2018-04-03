import React from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";
import { withFormik } from "formik";
import { gql } from "apollo-boost";
import { compose, graphql } from "react-apollo";

const Message = styled.div`
  grid-column: 3;
  grid-row: 3;
  padding: 15px;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Message>
    <Input
      name="message"
      value={values.message}
      fluid
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
