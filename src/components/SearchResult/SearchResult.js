import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import { get, noop, debounce, uniq } from 'lodash';
import { View } from 'native-base';

import { withStyleSheet } from '~theme';

const connectionFrgment = gql`
  fragment SearchResult_connection on Connection {
    edges {
      node {
        id
      }
    }

    totalCount
  }
`;

const searchHistoryQuery = gql`
  query SearchResultHistoryQuery($key: String!) {
    me {
      id
      recentIds: searchHistory(key: $key) @client
    }
  }
`;

@withStyleSheet('Sparkle.SearchResult', {
  root: {
    flex: 1,
  }
})
@withApollo
export default class SearchResult extends Component {
  static fragments = {
    connection: connectionFrgment,
  };

  static propTypes = {
    connectionPath: PropTypes.string.isRequired,
    historyKey: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    filterEdges: PropTypes.func.isRequired,
    search: PropTypes.string,
    renderBlank: PropTypes.func,
    onSearchingStateChange: PropTypes.func,
    onItemPress: PropTypes.func,
  };

  static defaultProps = {
    search: '',
    renderBlank: noop,
    onSearchingStateChange: noop,
    onItemPress: noop,
  };

  scheduledQueriesCount = 0;
  lastValidResult = null;

  sheduleQuery = debounce(async () => {
    const { client, search, onSearchingStateChange } = this.props;

    if (!search.length) {
      return;
    }

    if (this.scheduledQueriesCount++ === 0) {
      requestAnimationFrame(() => onSearchingStateChange(true));
    }

    try {
      await client.query({ ...this.getQueryOptions(), fetchPolicy: 'network-only' });
    } catch {
      // Do nonthing...
    }

    if (this.scheduledQueriesCount > 0 && --this.scheduledQueriesCount <= 0) {
      requestAnimationFrame(() => onSearchingStateChange(false));
    }
  }, 100);

  renderResult = ({ data }) => {
    const { search, filterEdges, children: renderList, connectionPath } = this.props;
    const unfilteredEdges = get(data, [connectionPath, 'edges'], this.lastValidResult);
    const edges = (unfilteredEdges || []).filter(edge => filterEdges(edge, search));
    const loading = unfilteredEdges === null;
    this.lastValidResult = unfilteredEdges;
    
    return !loading && renderList({
      edges,
      onItemPress: this.onItemPress,
    });
  }

  renderBlank = () => {
    const { renderBlank, historyKey } = this.props;

    return (
      <Query fetchPolicy="cache-first" query={searchHistoryQuery} variables={{ key: historyKey }}>
        {({ data }) => renderBlank({
          recentIds: data.me?.recentIds || [],
          onItemPress: this.onItemPress,
        })}
      </Query>
    );
  };

  addHistoryRecord = ({ node }) => {
    const { client, historyKey } = this.props;
    const query = searchHistoryQuery;
    const variables = { key: historyKey };
    const data = client.readQuery({ query, variables });

    data.me.recentIds = uniq([...data.me.recentIds, node.id]);
    client.writeQuery({ query, variables, data });
  };

  onItemPress = (item) => {
    const { onItemPress } = this.props;

    onItemPress(item);
    setTimeout(() => this.addHistoryRecord(item));
  }

  getQueryOptions() {
    const { query, search } = this.props;

    return {
      query,
      variables: { search, first: 50 },
    };
  }

  reset() {
    const { onSearchingStateChange } = this.props;

    this.lastValidResult = null;
    this.scheduledQueriesCount = 0;

    requestAnimationFrame(() => onSearchingStateChange(false));
  }

  shouldComponentUpdate({ search }) {
    return this.props.search !== search;
  }

  componentDidUpdate() {
    const { search } = this.props;

    if (search.length) {
      this.sheduleQuery();
    } else {
      this.reset();
    }
  }

  render() {
    const { styleSheet: styles, search } = this.props;
    
    /**
     * TODO: Do not unmount blank screen. Use `react-native-screens` or some other technic to keep it in hidden in memory.
     */
    return (
      <View style={styles.root}>
        {!search ? this.renderBlank() : (
          <Query {...this.getQueryOptions()} fetchPolicy='cache-only'>
            {this.renderResult}
          </Query>
        )}
      </View>
    );
  }
}
