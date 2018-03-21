import React from 'react';
import {Container, Header, Input, Button} from 'semantic-ui-react';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';

class Register extends React.Component {
  state = {
      username: '',
      email: '',
      password: '',
      loading: false,
  }  

  onChange = (e) => {
    const {name, value} = e.target;

    this.setState((prevstate, props)  => {
       return { [name]: value}
    })
  }

  onSubmit = async () => {
      this.setState((prevState) => {
          return {loading: !prevState.loading}
        })
        
        const response = await this.props.mutate({
            variables: this.state
        })

        console.log(response);
    }


  render() {
    const {username, email, password, loading} = this.state;

    return (
        <Container text>
            <Header  as='h2'>Register Form</Header>
            <Input  
                name="username" 
                onChange={this.onChange}
                value={username} 
                fluid 
                placeholder='Username' 
             />

            <Input  
                name="email"
                onChange={this.onChange}
                value={email}
                fluid
                placeholder='Email' 
            />

            <Input  
                name="password" 
                onChange={this.onChange} 
                value={password}type="password" 
                fluid 
                placeholder='Password' 
            />

            <Button 
                onClick={this.onSubmit}
                loading={loading ? true : null}
                primary
             >Register</Button>

        </Container>
    )

    
  }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password)
    }
`


export default graphql(registerMutation)(Register);
