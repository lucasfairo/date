import React from 'react';
import { Image, View } from 'react-native';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs';
import moment from 'moment';
import faker from 'faker';
import { find, orderBy, sample, sampleSize, shuffle } from 'lodash';

import { getApolloDecorator, getContentDecorator } from 'storybook';
import { createConnection } from 'storybook/decorators/Apollo';
import ImageView from './ImageView';
import TouchableOpacity from '../TouchableOpacity';
import PhotoList from '../PhotoList';

const stories = storiesOf('Components/ImageView', module);

const typeDefs = gql`
  scalar Cursor
  scalar Date

  type Query {
    me: User!
    node(id: ID!): Photo!
  }

  type User {
    id: ID!
    name: String!
    avatar: Avatar!
    photos(first: Int, after: Cursor, last: Int, before: Cursor): UserPhotoConnection!
  }

  type Avatar {
    id: ID!
    url(size: AvatarSize = SMALL): String!
    small(size: AvatarSize = SMALL): String!
  }

  enum AvatarSize {
    SMALL
    MEDIUM
    BIG
  }

  type UserPhotoConnection {
    pageInfo: PageInfo!
    metaInfo: ConnectionMetaInfo!
    edges: [PhotoEdge!]!
    totalCount: Int
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: Cursor
    endCursor: Cursor
  }

  type ConnectionMetaInfo {
    firstCursor: Cursor!
  }

  type PhotoEdge {
    node: Photo!
    cursor: Cursor!
  }
  
  type Photo {
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
`;

const userPhotosQuery = gql`
  query UserPhotosQuery {
    user: me {
      ...on User {
        photos {
          edges {
            ...PhotoList_edge
          }
        }
      }
    }
  }

  ${PhotoList.fragments.edge}
`;

const dataStore = (() => {
  const generateName = () => `${faker.name.firstName()} ${faker.name.lastName()}`;
  const generateDate = () => (
    moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
  );
  const users = Array.from({ length: 10 }).map((item, index) => ({
    id: `User:${index + 1}`,
    name: generateName(),
    avatar: {
      id: `Avatar:${index + 1}`,
      url: faker.image.avatar(),
    },
  }));
  const photos = shuffle(['https://newbor.by/upload/iblock/dbf/dom_1.jpg', 'https://newbor.by/upload/resize_cache/iblock/ded/1024_768_040cd750bba9870f18aada2478b24840a/dom_2.jpg', 'https://newbor.by/upload/iblock/5dd/dom_3.jpg', 'https://newbor.by/upload/iblock/759/dom_4.jpg', 'https://newbor.by/upload/resize_cache/iblock/995/1024_768_040cd750bba9870f18aada2478b24840a/dom_5.jpg', 'https://newbor.by/upload/resize_cache/iblock/d5c/1024_768_040cd750bba9870f18aada2478b24840a/dom_8.14.jpg', 'https://newbor.by/upload/resize_cache/iblock/1a9/1024_768_040cd750bba9870f18aada2478b24840a/dom_11.jpg', 'https://newbor.by/upload/iblock/13f/dom_8.jpg', 'https://newbor.by/upload/resize_cache/iblock/5d7/1024_768_040cd750bba9870f18aada2478b24840a/dom_10.jpg', 'https://newbor.by/upload/iblock/0f1/dom_13.jpg', 'https://newbor.by/upload/iblock/52d/6.6-min.jpg', 'https://newbor.by/upload/iblock/42d/6.3.jpg', 'https://newbor.by/upload/iblock/861/6.6.jpg', 'https://newbor.by/upload/iblock/7f2/detskiy-sad-7.jpg', 'https://newbor.by/upload/resize_cache/iblock/953/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-8.jpg', 'https://newbor.by/upload/iblock/55a/detskiy-sad-6.jpg', 'https://newbor.by/upload/iblock/951/detskiy-sad-1.jpg', 'https://newbor.by/upload/resize_cache/iblock/870/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-9.jpg', 'https://newbor.by/upload/resize_cache/iblock/0ff/1024_768_040cd750bba9870f18aada2478b24840a/fontan-v-novoy-borovoy-_-obshchiy-plan-_2.jpg', 'https://newbor.by/upload/resize_cache/iblock/3f5/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-kedrovogo-kvartala.jpg', 'https://newbor.by/upload/resize_cache/iblock/421/1024_768_040cd750bba9870f18aada2478b24840a/obshchestvennye-prostranstva.jpg', 'https://newbor.by/upload/resize_cache/iblock/7b0/1024_768_040cd750bba9870f18aada2478b24840a/veloboksy-vo-dvorakh-novoy-borovoy.jpg', 'https://newbor.by/upload/iblock/549/dji_0234.jpg', 'https://newbor.by/upload/iblock/8b6/dji_0286.jpg', 'https://newbor.by/upload/iblock/595/shkola_2.png', 'https://newbor.by/upload/iblock/6a8/shkola_1.png', 'https://newbor.by/upload/iblock/9cd/shkola_4.png', 'https://newbor.by/upload/iblock/cff/shkola_5.png', 'https://newbor.by/upload/iblock/689/shkola_6.png', 'https://newbor.by/upload/iblock/d34/shkola_7.png', 'https://newbor.by/upload/resize_cache/iblock/6b8/1024_768_040cd750bba9870f18aada2478b24840a/shkola_01.png', 'https://newbor.by/upload/iblock/b25/shkola_3-_2_.png', 'https://newbor.by/upload/resize_cache/iblock/a80/1024_768_040cd750bba9870f18aada2478b24840a/shkola_0.png', 'https://newbor.by/upload/iblock/cfe/shkola_8.png', 'https://newbor.by/upload/resize_cache/iblock/70e/1024_768_040cd750bba9870f18aada2478b24840a/vezd-v-novuyu-borovuyu.jpg']);

  return {
    users,

    photos: Array.from({ length: photos.length }).map((item, index) => ({
      id: `Photo:${index + 1}`,
      url: photos[index],
      caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
      user: sample(users),
      createdAt: generateDate(),
      comments: index ? orderBy(
        Array.from({ length: faker.random.number({ min: 30, max: 100 }) }).map(() => ({
          id: `Comment:${faker.random.number()}`,
          text: faker.lorem.text(),
          createdAt: generateDate(),
          user: sample(users),
        })),
        'createdAt',
        'desc',
      ) : [],
    })),
  };
})();

const resolvers = {
  Query: {
    me: (root, args, { dataStore: { users } }) => find(users, { id: 'User:1' }),
    node: (root, { id }, { dataStore: { photos } }) => find(photos, { id }),
  },

  User: {
    photos(user, args, { dataStore: { photos } }) {
      return createConnection(photos, args);
    },
  },

  Photo: {
    comments(photo, args) {
      return createConnection(photo.comments, args);
    },
  },
};

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));
stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

// Stories
stories.add('Default', () => {
  const styles = {
    view: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    image: {
      width: 100,
      height: 100,
      marginRight: 8,
      marginBottom: 8,
      borderRadius: 8,
    },
  };

  return (
    <Query query={userPhotosQuery}>
      {({ loading, data }) => {
        if (loading) return null;

        const { user: { photos: { edges } } } = data;

        return (
          <ImageView edges={edges}>
            {onShowImage => (
              <View style={styles.view}>
                {edges.map(({ node: { id, url } }, index) => (
                  <TouchableOpacity key={id} onPress={() => onShowImage(index)}>
                    <Image source={{ uri: url }} style={styles.image} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ImageView>
        );
      }}
    </Query>
  );
});
