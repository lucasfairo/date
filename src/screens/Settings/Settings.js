import React, { Component } from 'react';
import { Container } from 'native-base';

import { withStyleSheet } from '~theme';
import { SettingList } from '~components';

@withStyleSheet('Sparkle.SettingsScreen')
export default class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  };

  render() {
    return (
      <Container>
        <SettingList contentInset={{ bottom: 0 }} />
      </Container>
    );
  }
}
