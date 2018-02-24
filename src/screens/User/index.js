import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Screen from './User';

const withUser = graphql(gql`
  query getUsers($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`, {
  options: ({ navigation: { state: { params } } }) => ({
    variables: {
      id: params.id,
    }
  }),
});

export default withUser(Screen);
