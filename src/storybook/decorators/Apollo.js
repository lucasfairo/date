import React, { Component } from 'react';
import { isFunction, cloneDeep, range } from 'lodash';
import { ApolloProvider } from 'react-apollo';
import { setContext } from "apollo-link-context";
import { ApolloLink } from 'apollo-link';
import { SchemaLink } from 'apollo-link-schema';
import MockAsyncStorage from 'mock-async-storage';
import delay from 'promise-delay';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
  addResolveFunctionsToSchema,
} from 'graphql-tools';

import { createClient } from 'graph';

function createSchemaLink({ typeDefs, mocks, resolvers, dataStore = {} }) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions :{
      requireResolversForResolveType: false
    },
  });

  if (mocks) {
    addMockFunctionsToSchema({
      schema,
      mocks
    });
  }

  if (resolvers) {
    addResolveFunctionsToSchema({
      schema,
      resolvers,
    });
  }

  return new SchemaLink({
    schema,
    context: {
      dataStore,
    },
  });
}

function createProgressLink({ progressOptions = {} }) {
  const total = progressOptions.total || 100;
  const step = progressOptions.step || 10;
  const getDelay = isFunction(progressOptions.delay)
    ? progressOptions.delay
    : () => progressOptions.delay || Math.random() * 100;

  return setContext(async (request, { fetchOptions = {} }) => {
    let uploadPromise = Promise.resolve();
    let canceled = false;

    if (fetchOptions.uploadProgress) {
      uploadPromise = range(0, total + step, step).reduce((prev, tick) => prev.then(async () => {
        if (canceled) {
          throw new Error('Upload canceled');
        }

        await delay(getDelay(tick));

        if (!canceled) {
          fetchOptions.uploadProgress(tick, total)
        }
      }), uploadPromise);
    }

    if (fetchOptions.uploadStart) {
      fetchOptions.uploadStart({
        cancel: () => {
          console.log('API: cancel');
          canceled = true;
        },
      });
    }

    if (fetchOptions.uploadEnd) {
      uploadPromise.then(fetchOptions.uploadEnd, fetchOptions.uploadEnd);
    }

    await uploadPromise;
  });
}

function createTerminatingLink(options) {
  return ApolloLink.from([
    createProgressLink(options),
    createSchemaLink(options),
  ]);
}

class Provider extends Component {
  state = {
    client: null,
  };

  componentDidMount() {
    createClient({
      restoreCache: false,
      persistorStorage: new MockAsyncStorage(),
      terminatingLink: createTerminatingLink(this.props),
    }).then(client => this.setState({
      client,
    }));
  }

  render() {
    const { client } = this.state;
    const { children } = this.props;

    return client && (
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    );
  }
}

export default ({
  typeDefs,
  mocks,
  resolvers,
  dataStore = {},
}) => story => (
  <Provider
    typeDefs={typeDefs}
    mocks={mocks}
    resolvers={resolvers}
    dataStore={
      isFunction(dataStore)
        ? dataStore()
        : cloneDeep(dataStore)
    }
  >
    {story()}
  </Provider>
);