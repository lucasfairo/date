import React, { PureComponent } from 'react';
import { withNavigationFocus } from 'react-navigation';

import { withStyleSheet } from 'theme';
import { USER } from '../roteNames';
import MyFriendsConnection from './MyFriendsConnection';

@withStyleSheet('Sparkle.MyFriendsScreen', {
  list: {
    paddingTop: 8,
  },
})
@withNavigationFocus
export default class MyFriends extends PureComponent {
  static navigationOptions = {
    title: 'Friends',
  };

  onItemPress = ({ node: { id } }) => {
    const { navigation } = this.props;

    navigation.navigate(USER, { id });
  };

  render() {
    const { isFocused, styleSheet: styles } = this.props;

    return (
      <MyFriendsConnection 
        skip={!isFocused} 
        ontentContainerStyle={styles.list} 
        onItemPress={this.onItemPress}
      />
    );
  }
}
