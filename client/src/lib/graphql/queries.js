import { ApolloClient, ApolloLink, InMemoryCache, concat, createHttpLink, gql } from "@apollo/client";
import { getAccessToken } from "../auth";

// backend server url for graphql
const url = "http://localhost:9000/graphql";
const httpLink = createHttpLink({ uri: url });
const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken();
  if (token)
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authLink, httpLink),
});

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    title
    description
    date
    company {
      id
      name
    }
  }
`;

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`;

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
