import React, { Component } from 'react';
import propTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Button, Form, Text, View } from 'native-base';
import { withFormik } from 'formik';
import * as yup from 'yup';
import { withStyleSheet as styleSheet } from 'theme';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { TextInput, Icon } from 'components';

const readTokenQuery = gql`
  {
    auth @client {
      token
    }
  }
`;

@styleSheet('Sparkle.SignInForm', {
  form: {
    position: 'relative',
  },

  showPassword: {
    position: 'absolute',
    right: -28,
    top: 70,
  },

  showPasswordIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },

  infoBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
  },

  commonError: {
    fontSize: 12,
    color: '#FF8787',
  },

  forgotPassword: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  submit: {
    marginTop: 48,
  },
})
class SignInForm extends Component {
  static propTypes = {
    defaultEmail: propTypes.string,
    onSubmit: propTypes.func.isRequired,
    onForgotPassword: propTypes.func.isRequired,
  };

  static defaultProps = {
    defaultEmail: '',
  };

  state = {
    isPasswordIsShown: false,
  };

  onShowPassword() {
    this.setState({ isPasswordIsShown: !this.state.isPasswordIsShown });
  }

  isAuthIsValid(token) {
    const { isSubmitting, submitCount, status } = this.props;

    return !isSubmitting && !!submitCount && !token && !status.changed;
  }

  render() {
    const {
      styleSheet: styles,
      values: {
        login,
      },
      onForgotPassword,
      handleSubmit,
      isValid,
    } = this.props;
    const disabled = !(isValid || login);
    const { isPasswordIsShown } = this.state;

    return (
      <Query query={readTokenQuery}>
        {({ data: { auth: { token } } }) => {
          const error = this.isAuthIsValid(token);

          return (
            <Form>
              <TextInput
                name="login"
                placeholder="Email or login"
                customStyle={{
                  marginBottom: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  borderBottomWidth: 0,
                }}
                error={error}
                {...this.props}
              />

              <TextInput
                name="password"
                placeholder="Password"
                infoText="At least 4 characters"
                customStyle={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
                error={error}
                secureTextEntry={!isPasswordIsShown}
                {...this.props}
              />

              <TouchableOpacity onPress={::this.onShowPassword} style={styles.showPassword}>
                <Icon
                  name={isPasswordIsShown ? 'eye' : 'eye-crossed'}
                  style={styles.showPasswordIcon}
                />
              </TouchableOpacity>

              <View style={styles.infoBlock}>
                <TouchableOpacity onPress={() => onForgotPassword(login)}>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>

                {error && <Text style={styles.commonError}>Wrong login or password</Text>}
              </View>

              <Button onPress={handleSubmit} disabled={disabled} style={styles.submit} block>
                <Text>Submit</Text>
              </Button>
            </Form>
          );
        }}
      </Query>
    );
  }
}

const validationSchema = yup.object().shape({
  login: yup.string().required('Email or login is required').min(3, 'Email or login is too short'),
  password: yup.string().required('Password is required').min(4, 'Password is too short'),
});

export default withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ defaultEmail }) => defaultEmail
    ? ({ login: defaultEmail, password: '' })
    : ({ login: 'admin', password: 'admin' }) // @TODO: remove it
  ,
  handleSubmit: (values, { props, ...formikBag }) => props.onSubmit(values, formikBag),
  validationSchema,
})(SignInForm);
