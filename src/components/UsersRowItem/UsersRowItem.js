import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import LinearGradient from 'react-native-linear-gradient';
import { View as ViewRN, StyleSheet } from 'react-native';
import { View, Text } from 'native-base';

import { withStyle } from '~theme';
import UserAvatar from '../UserAvatar';
import Placeholder from '../Placeholder';
import Touchable from '../TouchableOpacity';

const userFragment = gql`
  fragment UsersRowItem_user on User {
    id
    name
    ...UserAvatar_user
  }

  ${UserAvatar.fragments.user}
`;

@withStyle('Sparkle.UsersRowItem', {
  width: 75,
  padding: 5,

  'Sparkle.TouchableOpacity': {
    overflow: 'hidden',
    alignItems: 'center',

    'NativeBase.Text': {
      fontSize: 12,
    },

    'Sparkle.UserAvatar': {
      marginBottom: 6,
    },
  },

  'Sparkle.Placeholder': {
    alignItems: 'center',

    'NativeBase.ViewNB': {
      backgroundColor: '#F3F4F7',

      '.avatar': {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginBottom: 6,
      },

      '.name': {
        height: 12,
        width: '100%',
        borderRadius: 4,
      },
    },
  },
})
export default class UserListItem extends Component {
  static fragments = {
    user: userFragment,
  };

  static propTypes = {
    user: fragmentProp(userFragment),
    onPress: PropTypes.func,
  };

  static defaultProps = {
    user: null,
    onPress: () => {},
  };

  renderPlaceholder() {
    const { style } = this.props;

    return (
      <Placeholder style={style}>
        <View avatar />
        <View name />
      </Placeholder>
    );
  }

  render() {
    const { user, onPress, ...props } = this.props;

    if (!user) {
      return this.renderPlaceholder();
    }

    return (
      <ViewRN {...props}>
        <Touchable onPress={onPress}>
          <UserAvatar size="medium" user={user} foreground />
          <ViewRN>
            <Text numberOfLines={1} ellipsizeMode="clip">{user.name}</Text>
            <LinearGradient
              colors={['#FFF0', '#FFF']} // TODO: Add theme variables support
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                ...StyleSheet.absoluteFillObject,
                width: 15,
                left: null,
              }}
            />
          </ViewRN>
        </Touchable>
      </ViewRN>
    );
  }
}
