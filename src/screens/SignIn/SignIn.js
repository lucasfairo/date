import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import SignInForm from './SignInForm';
import Divider from './Divider';
import * as routes from '../routeNames';
import { AppContextConsumer } from '../../application';

const Background = connectToStyleSheet('background', ImageBackground).withProps({
  source: { uri: 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg' },
});
const Title = connectToStyleSheet('title', H1);
const FacebookButton = connectToStyleSheet('facebookButton', Button);
const SignUpButton = connectToStyleSheet('signUpButton', Button);

@styleSheet('Sparkle.SignInScreen', {
  background: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignSelf: 'center',
    minWidth: 320,
    width: '100%',
    paddingLeft: '10%',
    paddingRight: '10%',
  },

  title: {
    marginVertical: 34,
    alignSelf: 'center',
    fontSize: 30,
    color: '#FFFFFF',
  },

  facebookButton: {
    backgroundColor: '#6D83CC',
  },

  signUpButton: {
    marginTop: 8,
  },
})
export default class SignInScreen extends Component {
  state = { defaultEmail: '' };

  onSubmit = async ({ login, password }, { setSubmitting, status, setStatus }) => {
    const { authenticate, navigation: { navigate } } = this.props;
    const success = await authenticate(login, password);

    setStatus({ ...status, success });
    setSubmitting(false);

    if (success) navigate(routes.APPLICATION);
  };

  render() {
    const { navigation: { navigate }, styleSheet } = this.props;

    return (
      <Container>
        <Background>
          <Content padder contentContainerStyle={styleSheet.content}>
            <Title>Sign in</Title>

            <FacebookButton block onPress={() => alert('Sign in via Facebook')}>
              <Text>Sign in via Facebook</Text>
            </FacebookButton>

            <Divider>or</Divider>

            <SignInForm
              defaultEmail={this.state.defaultEmail}
              onSubmit={this.onSubmit}
              onForgotPassword={login => navigate({
                routeName: routes.FORGOT_PASSWORD,
                params: {
                  defaultLogin: login,
                  setDefaultEmail: defaultEmail => this.setState({ defaultEmail }),
                },
              })}
            />

            <SignUpButton block bordered light onPress={() => navigate(routes.SIGN_UP)}>
              <Text>Sign up</Text>
            </SignUpButton>

            <AppContextConsumer>
              {({ onReset }) => (
                <SignUpButton block bordered light onPress={onReset}>
                  <Text>Change Website URL</Text>
                </SignUpButton>
              )}
            </AppContextConsumer>
          </Content>
        </Background>
      </Container>
    );
  }
}
