import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Content, View, Spinner } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import {
  DashboardHeading,
  UserBriefCard,
  UserFriendsCard,
  UserPhotosCard,
  UserPhotos,
  Icon,
} from 'components';
import * as routes from '../roteNames';
import LogoutButton from './LogoutButton';

@graphql(gql`
  query DashboardQuery {
    user: me {
      id
      ...DashboardHeading_user
      ...UserBriefCard_user
      ...UserFriendsCard_user
      ...UserPhotosCard_user
    }
  }

  ${DashboardHeading.fragments.user}
  ${UserBriefCard.fragments.user}
  ${UserFriendsCard.fragments.user}
  ${UserPhotosCard.fragments.user}
`)
@styleSheet('Sparkle.DashboardScreen')
export default class Dashboard extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="user-bar" style={{ color: tintColor, fontSize: 20 }} />
    ),

    headerStyle: {
      backgroundColor: '#F8F9FB',
    },

    headerRight: <LogoutButton />,
  };

  render() {
    const { styleSheet, data: { user }, navigation: { navigate } } = this.props;

    return (
      <Container style={styleSheet.container}>
        <Content>
          {
            user ? (
              <View>
                <DashboardHeading
                  style={styleSheet.head}
                  user={user}
                  onEditPress={() => navigate(routes.PROFILE_EDIT)}
                  onSettingsPress={() => navigate(routes.SETTINGS)}
                />
                <View horizontalPadder>
                  <UserBriefCard user={user} />
                  <UserFriendsCard user={user} onItemPress={id => navigate(routes.USER, { id })} />
                  <UserPhotos userId={user.id} />
                </View>
              </View>
            ) : (
              <Spinner />
            )
          }
        </Content>
      </Container>
    );
  }
}
