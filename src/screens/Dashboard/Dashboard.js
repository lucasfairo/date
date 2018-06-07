import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Content, View, Icon, Spinner } from 'native-base';

import { withStyleSheet as styleSheet } from 'theme';
import { DashboardHeading, UserBriefCard, UserFriendsCard, UserPhotosCard, PhotoPreview } from 'components';
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
    title: 'Dashboard',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="ios-settings-outline" style={{ color: tintColor }} />
    ),
    headerRight: <LogoutButton />,
  };

  render() {
    const { styleSheet, data: { user }, navigation: { navigate } } = this.props;

    return (
      <Container>
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
                  <PhotoPreview photos={user.photos.edges.map(({ node }) => ({ url: node.url }))}>
                    {onOpen => <UserPhotosCard user={user} onPress={index => onOpen(index)} />}
                  </PhotoPreview>
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
