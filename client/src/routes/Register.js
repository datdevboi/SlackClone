import React from 'react';
import {Container, Header, Input, Button, Message} from 'semantic-ui-react';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';

class Register extends React.Component {
  state = {
      username: '',
      usernameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      loading: false,
  }  

  onChange = (e) => {
    const {name, value} = e.target;

    this.setState((prevstate, props)  => {
       return { [name]: value, loading: false}
    })
  }

  onSubmit = async () => {
      
        this.setState((prevState) => {
            return {
                usernameError: '',
                passwordError: '',
                emailError: ''
            }
        })

      const {username, email, password} = this.state;
      this.setState((prevState) => {
          return {loading: !prevState.loading}
        })
        
        const response = await this.props.mutate({
            variables: {
                username,
                email,
                password
            }
        })

        const {ok , errors} = response.data.register;

        if(ok) {
            this.props.history.push('/');
        } else {
            const err = {};
            errors.forEach(({path, message}) => {
                err[`${path}Error`] = message;
            });

            this.setState((prevState) => {
                return {
                    ...err,
                    loading: false
                }
            });
        }

        console.log(response);
    }


  render() {
    const {username, email, password, loading, usernameError, emailError, passwordError} = this.state;

    const errorList = [];
    if (usernameError) {
        errorList.push(usernameError);
    }
    if (passwordError) {
        errorList.push(passwordError);
    }
    if (emailError) {
        errorList.push(emailError);
    }


    return (
        <Container text>
            <Header  as='h2'>Register Form</Header>
            <Input  
                name="username" 
                onChange={this.onChange}
                value={username} 
                fluid 
                error={!!usernameError}
                placeholder='Username' 
             />

            <Input  
                name="email"
                onChange={this.onChange}
                value={email}
                fluid
                error={!!emailError}
                placeholder='Email' 
            />

            <Input  
                name="password" 
                onChange={this.onChange} 
                value={password}type="password" 
                fluid 
                error={!!passwordError}
                placeholder='Password' 
            />

            <Button 
                onClick={this.onSubmit}
                loading={loading ? true : null}
                primary
             >Register</Button>

             {(usernameError || emailError || passwordError) ? <Message
                error
                header='There was some errors with your submission'
                list={errorList}
                /> : null}

        </Container>
    )

    
  }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password){
            ok
            errors {
                path
                message
            }
        }
    }
`


export default graphql(registerMutation)(Register);
