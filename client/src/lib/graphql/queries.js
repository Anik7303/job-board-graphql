import { ApolloClient, InMemoryCache, createHttpLink, gql } from "@apollo/client";

// backend server url for graphql
const url = "http://localhost:9000/graphql";
const httpLink = createHttpLink({ uri: url });

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export async function getJobs() {
  const jobsQuery = gql`
    query Jobs {
      jobs {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await client.query({ query: jobsQuery });
  return data?.jobs;
}

export async function getJob(id) {
  const jobByIdQuery = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
    }
  `;
  const { data } = await client.query({
    query: jobByIdQuery,
    variables: { id },
  });
  return data?.job;
}
