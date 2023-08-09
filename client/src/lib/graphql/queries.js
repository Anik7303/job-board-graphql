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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authLink, httpLink),
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

export async function getCompany(id) {
  const companyByIdQuery = gql`
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

  const { data } = await client.query({
    query: companyByIdQuery,
    variables: { id },
  });
  return data?.company;
}

export async function createJob({ title, description }) {
  const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
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
  const { data } = await client.mutate({
    mutation: createJobMutation,
    variables: { input: { title, description } },
  });
  return data?.job;
}
