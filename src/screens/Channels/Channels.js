import React, { Component } from 'react';
import { Container } from 'native-base';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { ChatList, Icon, SearchBar } from 'components';
import * as routes from '../routeNames';

@graphql(gql`
  query {
    me {
      id
      ...ChatList_user
    }
  }
  
  ${ChatList.fragments.user}
`)
export default class Channels extends Component {
  static navigationOptions = {
    title: 'Chats',
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon name="chats-bar" style={{ color: tintColor, fontSize: 20 }} />
    ),
  };

  onItemPress = ({ node }) => {
    const { navigation: { navigate } } = this.props;

    navigate(routes.CHANNEL, {
      chatId: node.id,
    });
  };

  render() {
    const { data: { me, loading } } = this.props;

    return (
      <Container>
        <SearchBar />

        {!loading && (
          <ChatList
            user={me}
            onItemPress={this.onItemPress}
          />
        )}
      </Container>
    );
  }
}
