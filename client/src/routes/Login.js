import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { Container, Header, Input, Button, Message } from 'semantic-ui-react';

export default observer(class Login extends Component {
      constructor(props) {
      super(props);

        extendObservable(this, {
        email: "",
          password: '',
      });
      }

      onSubmit = () => {
          const {email, password} = this;
          console.log(email, password);
      }


      onChange = (e) => {
        const {name, value} = e.target;

        this[name] = value;
      }
    render() {
        const { email, password } = this;
        return (
      <Container text>
          <Header as="h2">Login</Header>

          <Input
            name="email"
            onChange={this.onChange}
            value={email}
            fluid
            
            placeholder="Email"
          />

          <Input
            name="password"
            onChange={this.onChange}
            value={password}
            type="password"
            fluid
           
            placeholder="Password"
          />

          <Button
            onClick={this.onSubmit}
            
            primary
          >
            Register
          </Button>

          {/* {usernameError || emailError || passwordError ? (
            <Message
              error
              header="There was some errors with your submission"
              list={errorList}
            />
          ) : null} */}
        </Container>
        );
    }
  } );
