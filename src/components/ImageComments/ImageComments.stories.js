import React from 'react';
import { Button, Text, View } from 'native-base';
import { storiesOf } from '@storybook/react-native';
import { button, withKnobs } from '@storybook/addon-knobs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { PubSub } from 'graphql-subscriptions';
import { find, orderBy, range, sample, sampleSize, shuffle } from 'lodash';
import delay from 'promise-delay';
import faker from 'faker';
import moment from 'moment';
import uuid from 'uuid/v4';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ImageComments from './ImageComments';
import { photoDetailsQuery } from '../ImageView/ImageView';

const stories = storiesOf('Components/ImageComments', module);
const subscriptions = new PubSub();

const typeDefs = gql`
  scalar Cursor
  scalar Date

  interface Node {
    id: ID!
  }

  type Query {
    me: User!
    node(id: ID!): Photo!
  }

  type User {
    id: ID!
    name: String!
    avatar: Avatar!
    activityTime: Date!
  }

  type Avatar {
    id: ID!
    url(size: AvatarSize = SMALL): String!
  }

  enum AvatarSize {
    SMALL
    MEDIUM
    BIG
  }

  type Photo implements Node {
    id: ID!
    url: String!
    caption: String!
    createdAt: Date!
    user: User!
    comments(first: Int, after: Cursor, last: Int, before: Cursor): PhotoCommentsConnection!
  }

  type PhotoCommentsConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [CommentEdge!]!
    totalCount: Int
  }
  
  type ConnectionMetaInfo {
    firstCursor: Cursor!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type CommentEdge {
    node: Comment!
    cursor: Cursor!
  }

  type Comment {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  type Mutation {
    addPhotoComment(input: PhotoCommentInput!): PhotoCommentCreatePayload!
  }

  type Subscription {
    onPhotoCommentAdd(photoId: ID, userId: ID): PhotoCommentCreatePayload!
  }

  input PhotoCommentInput {
    userId: ID!
    photoId: ID!
    text: String!
  }

  type PhotoCommentCreatePayload {
    user: User!
    photo: Photo!
    node: Comment!
    edge: CommentEdge!
  }
`;

const dataStore = (() => {
  const generateName = () => `${faker.name.firstName()} ${faker.name.lastName()}`;
  const generateDate = () => (
    moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
  );
  const generateActivityTime = () => (
    moment(faker.date.between(moment().subtract(30, 'minutes').format(), moment())).toDate()
  );
  const users = range(10).map(index => ({
    id: `User:${index + 1}`,
    name: generateName(),
    avatar: {
      id: `Avatar:${index + 1}`,
      url: faker.image.avatar(),
    },
    activityTime: generateActivityTime(),
  }));
  const images = shuffle(['https://newbor.by/upload/iblock/dbf/dom_1.jpg', 'https://newbor.by/upload/resize_cache/iblock/ded/1024_768_040cd750bba9870f18aada2478b24840a/dom_2.jpg', 'https://newbor.by/upload/iblock/5dd/dom_3.jpg', 'https://newbor.by/upload/iblock/759/dom_4.jpg', 'https://newbor.by/upload/resize_cache/iblock/995/1024_768_040cd750bba9870f18aada2478b24840a/dom_5.jpg', 'https://newbor.by/upload/resize_cache/iblock/d5c/1024_768_040cd750bba9870f18aada2478b24840a/dom_8.14.jpg', 'https://newbor.by/upload/resize_cache/iblock/1a9/1024_768_040cd750bba9870f18aada2478b24840a/dom_11.jpg', 'https://newbor.by/upload/iblock/13f/dom_8.jpg', 'https://newbor.by/upload/resize_cache/iblock/5d7/1024_768_040cd750bba9870f18aada2478b24840a/dom_10.jpg', 'https://newbor.by/upload/iblock/0f1/dom_13.jpg', 'https://newbor.by/upload/iblock/52d/6.6-min.jpg', 'https://newbor.by/upload/iblock/42d/6.3.jpg', 'https://newbor.by/upload/iblock/861/6.6.jpg', 'https://newbor.by/upload/iblock/7f2/detskiy-sad-7.jpg', 'https://newbor.by/upload/resize_cache/iblock/953/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-8.jpg', 'https://newbor.by/upload/iblock/55a/detskiy-sad-6.jpg', 'https://newbor.by/upload/iblock/951/detskiy-sad-1.jpg', 'https://newbor.by/upload/resize_cache/iblock/870/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-9.jpg', 'https://newbor.by/upload/resize_cache/iblock/0ff/1024_768_040cd750bba9870f18aada2478b24840a/fontan-v-novoy-borovoy-_-obshchiy-plan-_2.jpg', 'https://newbor.by/upload/resize_cache/iblock/3f5/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-kedrovogo-kvartala.jpg', 'https://newbor.by/upload/resize_cache/iblock/421/1024_768_040cd750bba9870f18aada2478b24840a/obshchestvennye-prostranstva.jpg', 'https://newbor.by/upload/resize_cache/iblock/7b0/1024_768_040cd750bba9870f18aada2478b24840a/veloboksy-vo-dvorakh-novoy-borovoy.jpg', 'https://newbor.by/upload/iblock/549/dji_0234.jpg', 'https://newbor.by/upload/iblock/8b6/dji_0286.jpg', 'https://newbor.by/upload/iblock/595/shkola_2.png', 'https://newbor.by/upload/iblock/6a8/shkola_1.png', 'https://newbor.by/upload/iblock/9cd/shkola_4.png', 'https://newbor.by/upload/iblock/cff/shkola_5.png', 'https://newbor.by/upload/iblock/689/shkola_6.png', 'https://newbor.by/upload/iblock/d34/shkola_7.png', 'https://newbor.by/upload/resize_cache/iblock/6b8/1024_768_040cd750bba9870f18aada2478b24840a/shkola_01.png', 'https://newbor.by/upload/iblock/b25/shkola_3-_2_.png', 'https://newbor.by/upload/resize_cache/iblock/a80/1024_768_040cd750bba9870f18aada2478b24840a/shkola_0.png', 'https://newbor.by/upload/iblock/cfe/shkola_8.png', 'https://newbor.by/upload/resize_cache/iblock/70e/1024_768_040cd750bba9870f18aada2478b24840a/vezd-v-novuyu-borovuyu.jpg']);
  const generateComments = () => orderBy(range(99).map(index => ({
    id: `Comment:${index + 1}`,
    text: faker.lorem.text(),
    createdAt: generateDate(),
    user: sample(users),
  })), 'createdAt', 'desc');
  const photos = range(2).map(index => ({
    id: `Photo:${index + 1}`,
    url: images[index],
    caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
    user: sample(users),
    createdAt: generateDate(),
    comments: index ? generateComments() : [],
  }));

  return {
    users,
    photos,
  };
})();

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
    node: async (root, { id }, { dataStore: { photos } }) => {
      // This is Kostyl but it's just for Storybook
      if (id === 'Photo:Placeholders') {
        await delay(60 * 1000);

        return find(photos, { id: 'Photo:2' });
      }

      return find(photos, { id });
    },
  },

  Subscription: {
    onPhotoCommentAdd: {
      resolve: ({ userId, photoId, text }, args, { dataStore }) => {
        const { users, photos } = dataStore;
        const user = find(users, { id: userId });
        const photo = find(photos, { id: photoId });
        const node = {
          id: uuid(),
          text,
          createdAt: new Date(),
          user,
        };
        const cursor = 'first';

        photo.comments.push(node);

        return {
          user,
          photo,
          node,
          edge: {
            node,
            cursor,
          },
        };
      },

      subscribe: () => subscriptions.asyncIterator('onPhotoCommentAdd'),
    },
  },

  Mutation: {
    async addPhotoComment(root, args, { dataStore }) {
      const { input: { photoId, userId, text } } = args;
      const { users, photos } = dataStore;
      const user = find(users, { id: userId });
      const photo = find(photos, { id: photoId });
      const node = {
        id: `Comment:${photo.comments.length + 1}`,
        createdAt: new Date(),
        user,
        text,
      };
      const cursor = 'first';

      await delay(2000);

      photo.comments.push(node);

      return {
        user,
        photo,
        node,
        edge: {
          node,
          cursor,
        },
      };
    },
  },

  Photo: {
    async comments(photo, args) {
      return createConnection(orderBy(photo.comments, 'createdAt', 'desc'), args);
    },
  },

  Node: {
    __resolveType: ({ id }) => {
      const [type] = id.split(':');

      return type;
    }
  }
};

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));
stories.addDecorator(getApolloDecorator({ typeDefs, dataStore, resolvers }));

// Stories

stories.add('Placeholders', () => (
  <ImageComments photoId="Photo:Placeholders" totalCount={0}>
    {onShowImageComments => (
      <Button onPress={onShowImageComments}>
        <Text>Show Comments (Placeholders)</Text>
      </Button>
    )}
  </ImageComments>
));

stories.add('Empty State', () => (
  <ImageComments photoId="Photo:1" totalCount={0}>
    {onShowImageComments => (
      <Button onPress={onShowImageComments}>
        <Text>Show Comments (Empty State)</Text>
      </Button>
    )}
  </ImageComments>
));

stories.add('Fake Comments', () => {
  const photoId = 'Photo:2';

  return (
    <Query query={photoDetailsQuery} variables={{ id: photoId }}>
      {({ loading, data: { photo } }) => loading ? null : (
        <ImageComments photoId={photoId} totalCount={photo.comments.totalCount}>
          {onShowImageComments => (
            <Button onPress={onShowImageComments}>
              <Text>Show Comments {photo.comments.totalCount}</Text>
            </Button>
          )}
        </ImageComments>
      )}
    </Query>
  );
});

stories.add('Subscription', () => {
  const photoId = 'Photo:1';

  button('Generate comment', () => subscriptions.publish('onPhotoCommentAdd', {
    photoId,
    userId: 'User:2',
    text: faker.company.catchPhrase(),
  }));

  return (
    <View>
      <Query query={photoDetailsQuery} variables={{ id: photoId }}>
        {({ loading, data: { photo } }) => loading ? null : (
          <ImageComments photoId={photoId} totalCount={photo.comments.totalCount}>
            {onShowImageComments => (
              <Button onPress={onShowImageComments}>
                <Text>Show comments</Text>
              </Button>
            )}
          </ImageComments>
        )}
      </Query>
      <Text>
        {'\n'}You can generate comments with "Generate comment" button from Storybook Knobs
      </Text>
    </View>
  );
});
