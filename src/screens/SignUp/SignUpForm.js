import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import yup from 'yup';
import { Button, Form, RNContent, Text } from 'native-base';
import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import { graphql, ApolloConsumer, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { debounce, find, get, isEmpty } from 'lodash';

import TextInputItem from '../../components/Form/TextInputItem';

const validateEmailQuery = gql`
  query validateEmailQuery($email: String = "") {
    users(email: $email) {
      totalCount
    }
  }
`;

const signUpUserMutation = gql`
  mutation signUpUserMutation($input: SignUpUserInput!) {
    result: signUpUser(input: $input) {
      accessToken
      user {
        id
        name
        email
        activityTime
      }
    }
  }
`;

const SubmitButton = connectToStyleSheet('submitButton', Button).withProps(({ disabled }) => ({
  disabled,
  block: true,
}));

@graphql(gql`
  mutation($token: String!) {
    storeAuthToken(token: $token) @client
  }
`, {
  props: ({ mutate }) => ({
    storeToken: token => mutate({ variables: { token } }),
  }),
})
@styleSheet('Sparkle.SignUpForm', {
  submitButton: {
    marginTop: 40,
  },
})
class SignUpForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  state = { emailIsDuplicated: false };

  validateEmail = debounce(this.onValidateEmail, 200);

  async onValidateEmail(text, client) {
    if (this.props.errors.email) return;

    const { data } = await client.query({
      query: validateEmailQuery,
      variables: { email: text }
    });
    const emailIsDuplicated = !!get(data, 'users.totalCount', 0);

    if (emailIsDuplicated !== this.state.emailIsDuplicated) this.setState({ emailIsDuplicated });
  }

  onChangeEmail(text, client) {
    this.props.setFieldValue('email', text);
    this.validateEmail(text, client);
  }

  async onSubmit(signUpUser) {
    const { values: { name, email, password }, storeToken, onSubmit } = this.props;
    let success = false;

    try {
      const { data: { result } } = await signUpUser({
        variables: {
          input: {
            name,
            email,
            password,
          },
        },
      });

      await storeToken(result.accessToken);
      success = !!result.accessToken;
    } catch (error) {
      alert('Something went wrong'); // @TODO
    }

    if (success) onSubmit();
  }

  render() {
    const { isValid } = this.props;
    const { emailIsDuplicated } = this.state;

    return (
      <Form>
        <TextInputItem name="name" placeholder="Full Name" {...this.props} />

        <ApolloConsumer>
          {client => (
            <TextInputItem
              name="email"
              placeholder="Email"
              onChangeText={text => this.onChangeEmail(text, client)}
              secondaryErrorText={emailIsDuplicated && 'Email is taken'}
              {...this.props}
            />
          )}
        </ApolloConsumer>

        <TextInputItem
          name="password"
          placeholder="Password"
          infoText="At least 4 characters"
          secureTextEntry
          {...this.props}
        />

        <Mutation mutation={signUpUserMutation}>
          {signUpUser => (
            <SubmitButton onPress={() => this.onSubmit(signUpUser)} disabled={!(isValid && !emailIsDuplicated)} block>
              <Text>Sign up</Text>
            </SubmitButton>
          )}
        </Mutation>
      </Form>
    );
  }
}

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name is too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({ validationSchema })(SignUpForm);
