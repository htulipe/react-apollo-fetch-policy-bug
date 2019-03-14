import React from 'react';
import renderer from 'react-test-renderer';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { MockedProvider } from 'react-apollo/test-utils';

const GET_DOG_QUERY = gql`
  query getDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

const Dog = ({ name, fetchPolicy }) => (
  <Query query={GET_DOG_QUERY} variables={{ name }} fetchPolicy={fetchPolicy}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error!`;

      return (
        <p>
          {data.dog.name}
          is a
          {data.dog.breed}
        </p>
      );
    }}
  </Query>
);

Dog.propTypes = {
  name: PropTypes.string.isRequired,
  fetchPolicy: PropTypes.string
};

Dog.defaultProps = {
  fetchPolicy: null
};

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Buck'
      }
    },
    result: {
      data: {
        dog: { id: '1', name: 'Buck', breed: 'bulldog' }
      }
    }
  }
];

it('With default fetchPolicy', () => {
  renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dog name="Buck" fetchPolicy={null} />
    </MockedProvider>
  );
});

it('With no-cache fetchPolicy', () => {
  renderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dog name="Buck" fetchPolicy="no-cache" />
    </MockedProvider>
  );
});
