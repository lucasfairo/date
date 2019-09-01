import React, { Component } from 'react';
import { Container, View } from 'native-base';

import { withStyleSheet as styleSheet } from '~theme';
import { LogoAnimated } from '~components';

@styleSheet('iola.Splash', {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5259FF',
  },
})
export default class Splash extends Component {
  render() {
    const { styleSheet: styles } = this.props;

    return (
      <Container>
        <View style={styles.content}>
          <LogoAnimated />
        </View>
      </Container>
    );
  }
}
