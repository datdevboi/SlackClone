import React, { Component } from "react";
import { observer } from "mobx-react";
import { extendObservable } from "mobx";
import {
  Container,
  Header,
  Input,
  Button,
  Message,
  Form
} from "semantic-ui-react";
import { gql } from "apollo-boost";
import { graphql } from "react-apollo";

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: "",
      errors: {
        nameError: ""
      }
    });
  }

  onSubmit = async () => {
    const { name } = this;

    const response = await this.props.mutate({
      variables: {
        name
      }
    });

    const { ok, errors } = response.data.createTeam;

    console.log(errors);
    if (ok) {
      this.props.history.push("/");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.errors = err;
    }
  };

  onChange = e => {
    const { name, value } = e.target;

    this[name] = value;
  };
  render() {
    const { name, errors: { nameError } } = this;

    const errorList = [];
    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Container text>
        <Header as="h2">Create Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              fluid
              placeholder="Name"
            />
          </Form.Field>

          <Button onClick={this.onSubmit} primary>
            Create
          </Button>
        </Form>

        {errorList.length ? (
          <Message
            error
            header="There was some errors with your submission"
            list={errorList}
          />
        ) : null}
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
