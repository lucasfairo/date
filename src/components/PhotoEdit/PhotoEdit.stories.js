import React from 'react';
import { find, orderBy } from 'lodash';
import { uniqueId } from 'lodash';
import delay from 'promise-delay';
import { withHandlers } from 'recompose';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import PhotoEdit from './PhotoEdit';

const stories = storiesOf('Components/PhotoEdit', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const dataStore = {
  users: [
    {
      id: 'User:1',
      photos: [
        {
          id: 'Photo:1',
          url: 'https://images.unsplash.com/photo-1523444540064-c7c832de3364?w=400&h400',
          uploadTime: new Date(),
        },
        {
          id: 'Photo:2',
          url: 'https://images.unsplash.com/photo-1525025500848-f00b7d362dec?w=300&h=600',
          uploadTime: new Date(),
        },
        {
          id: 'Photo:3',
          url: 'https://images.unsplash.com/photo-1524850108227-6f2c213bf20d?w=800&h=600',
          uploadTime: new Date(),
        },
      ],
    },

    {
      id: 'User:2',
      photos: [],
    }
  ],
};

const typeDefs = gql`
  scalar Cursor
  scalar Upload
  scalar Date
  
  type Photo {
    id: ID!
    url: String!
  }
  
  type PhotoEdge {
    node: Photo!
    cursor: Cursor!
  }
  
  type UserPhotoConnection {
    edges: [PhotoEdge!]!
    totalCount: Int
  }
  
  type User {
    id: ID!
    photos(first: Int = 10, after: Cursor): UserPhotoConnection!
  }
  
  type Query {
    node(id: ID!): User!
  }
  
  input UserPhotoCreateInput {
    userId: ID!
    file: Upload!
    uploadTime: Date
  }

  type UserPhotoCreatePayload {
    user: User!
    node: Photo!
  } 
  
  type Mutation {
    addUserPhoto(input: UserPhotoCreateInput!): UserPhotoCreatePayload!
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore }) => find(dataStore.users, { id }),
  },

  Mutation: {
    addUserPhoto: async (root, { input }, { dataStore }) => {
      await delay(1000 + Math.random() * 1000);

      const user = find(dataStore.users, { id: input.userId });
      const node = {
        id: `Photo:${uniqueId()}`,
        url: input.file.blobPath,
      }

      user.photos.unshift(node);

      return {
        user,
        node,
      };
    },
  },

  User: {
    photos: (user, { first }) => {
      const photos = orderBy(user.photos, 'uploadTime').slice(0, first);

      return {
        totalCount: photos.length,
        edges: photos.map((photo, index) => ({
          cursor: `cursor:${index}`,
          node: {
            ...photo,
          },
        })),
      }
    },
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const query = gql`
  query($userId: ID!) {
    user: node(id: $userId) {
      id
      ...PhotoEdit_user
    }
  }
  
  ${PhotoEdit.fragments.user}
`;

// Stories
stories.add('With photos', () => {
  return (
    <Query query={query} variables={{ userId: 'User:1' }}>
      {({ data, loading }) => !loading && (
        <PhotoEdit user={data.user} />
      )}
    </Query>
  );
});

stories.add('No photos', () => {
  return (
    <Query query={query} variables={{ userId: 'User:2' }}>
      {({ data, loading }) => !loading && (
        <PhotoEdit user={data.user} />
      )}
    </Query>
  );
});
