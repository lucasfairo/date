import React from 'react';
import { find } from 'lodash';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { selectV2 as select, boolean, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import MessageItem from './MessageItem';
import Chat from '../Chat/Chat';

const stories = storiesOf('Components/MessageItem', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({
  padder: true,
  backgroundColor: '#F8F9FB',
}));

const messages = [
  {
    id: `Message:1`,
    content: {
      text: 'Hi how are you?',
    },
    status: null,
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: `Message:2`,
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning?',
    },
    status: null,
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: `Message:3`,
    content: {
      text: 'Hi how are you?',
    },
    createdAt: new Date(),
    status: 'DELIVERED',
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: `Message:4`,
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning?',
    },
    status: 'DELIVERED',
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: `Message:5`,
    content: {
      text: 'Hi how are you?',
    },
    createdAt: new Date(),
    status: 'READ',
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },

  {
    id: `Message:6`,
    content: {
      text: 'I’m fine, still working on project. I would like to meet you tomorrow, how about morning?',
    },
    status: 'READ',
    createdAt: new Date(),
    user: {
      id: 'User:1',
      name: 'Roman Banan',
      avatar: {
        id: 'Avatar:1',
        url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
      },
    },
  },
];

const dataStore = { messages };
const typeDefs = gql`
  scalar Date

  type Query {
    node(id: ID!): Message!
  }

  type Avatar {
    id: ID!
    url: String!
  }
  
  type User {
    id: ID!
    name: String!
    avatar: Avatar
  }

  type MessageContent {
    text: String
  }

  enum MessageStatus {
    DELIVERED
    READ
  }
  
  type Message {
    id: ID!
    status: MessageStatus
    content: MessageContent
    createdAt: Date!
    user: User!
  }
`;

const resolvers = {
  Query: {
    node: (root, { id }, { dataStore: { messages } }) => find(messages, { id }),
  },
};

stories.addDecorator(getApolloDecorator({ typeDefs, resolvers, dataStore }));

const messageQuery = gql`
  query($id: ID!) {
    message: node(id: $id) {
      id
      ...on Message {
        id
        ...MessageItem_message  
      }
    }
  }

  ${MessageItem.fragments.message}
`;

// Stories
stories.add('Short text', () => {
  const side = select('Side', {
    'Left': 'left',
    'Right': 'right',
  }, 'left');

  const messageId = select('Status', {
    'Null': 'Message:1',
    'DELIVERED': 'Message:3',
    'READ': 'Message:5',
  }, 'Message:1');

  const first = boolean('First', true);
  const last = boolean('Last', false);
  const hasAvatar = boolean('Has Avatar', true);

  return (
    <Query query={messageQuery}  variables={{ id: messageId }}>
      {({ data, loading }) => !loading && (

        <MessageItem
          message={data.message}
          left={side === 'left'}
          right={side === 'right'}
          last={last}
          first={first}
          hasAvatar={hasAvatar}
        />

      )}
    </Query>
  );
});


stories.add('Long text', () => {
  const side = select('Side', {
    'Left': 'left',
    'Right': 'right',
  }, 'left');

  const first = boolean('First', true);
  const last = boolean('Last', false);
  const hasAvatar = boolean('Has Avatar', true);

  return (
    <Query query={messageQuery} variables={{ id: 'Message:2' }}>
      {({ data, loading }) => !loading && (

        <MessageItem
          message={data.message}
          left={side === 'left'}
          right={side === 'right'}
          last={last}
          first={first}
          hasAvatar={hasAvatar}
        />

      )}
    </Query>
  );
});
