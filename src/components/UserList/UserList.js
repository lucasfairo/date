import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { propType as fragmentProp } from 'graphql-anywhere';
import { range } from 'lodash';

import { withStyleSheet } from '~theme';
import { FlatList, NoContent } from '../TabNavigator';
import UserListItem from '../UserListItem';

const edgeFragment = gql`
  fragment UserList_edge on Edge {
    node {
      id
      ...UserListItem_user
    }
  }
  
  ${UserListItem.fragments.user}
`;

@withStyleSheet('Sparkle.UserList')
export default class UserList extends Component {
  static fragments = {
    edge: edgeFragment,
  };

  static propTypes = {
    edges: PropTypes.arrayOf(
      fragmentProp(edgeFragment).isRequired
    ).isRequired,
    onItemPress: PropTypes.func,
    loading: PropTypes.bool,
    noContentText: PropTypes.string,
    noContentStyle: PropTypes.object,
  };

  static defaultProps = {
    onItemPress: () => {},
    loading: false,
    noContentText: undefined,
    noContentStyle: undefined,
  };

  extractItemKey = ({ node, key }) => key || node.id;

  renderItem = ({ item }) => {
    const { onItemPress } = this.props;
    const { node } = item;

    return (
      <UserListItem
        user={node}
        onPress={() => onItemPress(item)}
      />
    );
  };

  getPlaceholders = () => range(3).map(index => ({
    key: index.toString(),
  }));

  render() {
    const {
      edges,
      loading,
      styleSheet: styles,
      noContentText,
      noContentStyle,
      renderItem = this.renderItem,
      ...listProps
    } = this.props;

    const data = loading && !edges.length ? this.getPlaceholders() : edges;

    return (
      <FlatList
        ListEmptyComponent={(
          <NoContent
            style={noContentStyle}
            icon="users-empty-state"
            text={noContentText === undefined ? 'No users' : noContentText}
          />
        )}

        {...listProps}
        data={data}
        renderItem={renderItem}
        keyExtractor={this.extractItemKey}
      />
    );
  }
}
