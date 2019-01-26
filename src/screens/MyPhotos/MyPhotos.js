import React, { PureComponent } from 'react';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import MyPhotosConnection from './MyPhotosConnection';
import TabBarLabel from './TabBarLabel';

@withNavigationFocus
@withStyleSheet('Sparkle.MyPhotosScreen', {
  list: {
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  add: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    elevation: 5,
  },

  noContent: {
    marginTop: -12, // TODO: Aligning `No photos` to `No friends` - need to find a better way
  }
})
export default class UserPhotos extends PureComponent {
  static navigationOptions = {
    tabBarLabel: <TabBarLabel />,
  };

  render() {
    const { navigation, isFocused, styleSheet: styles } = this.props;

    return (
      <MyPhotosConnection
        skip={!isFocused} 
        addButtonStyle={styles.add}
        contentContainerStyle={styles.list}
        noContentStyle={styles.noContent}
      />
    );
  }
}
