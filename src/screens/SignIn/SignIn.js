import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
import { Button, Container, Content, Text, H1 } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import SignInForm from './SignInForm';
import Divider from './Divider';
import * as routes from '../routeNames';

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

  button: {
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
    const {
      navigation: { navigate },
      screenProps: { onApplicationReset },
      styleSheet: styles,
    } = this.props;
    const backgroundURL = 'https://blog.oxforddictionaries.com/wp-content/uploads/mountain-names.jpg';

    return (
      <Container>
        <ImageBackground style={styles.background} source={{ uri: backgroundURL }}>
          <Content padder contentContainerStyle={styles.content}>
            <H1 style={styles.title}>Sign in</H1>

            <Button
              style={styles.facebookButton}
              onPress={() => alert('Sign in via Facebook')}
              block
            >
              <Text>Sign in via Facebook</Text>
            </Button>

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

            <Button
              style={styles.button}
              onPress={() => navigate(routes.SIGN_UP)}
              block
              bordered
              light
            >
              <Text>Sign up</Text>
            </Button>

            <Button style={styles.button} onPress={onApplicationReset} block bordered light>
              <Text>Change Website URL</Text>
            </Button>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}
