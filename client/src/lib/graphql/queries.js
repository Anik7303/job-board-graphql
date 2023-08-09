import { GraphQLClient } from "graphql-request";

// backend server url for graphql
const url = "http://localhost:9000/graphql";

const client = new GraphQLClient(url);

export async function getJobs() {
  const query = `#graphql
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
  const { jobs } = await client.request(query);
  return jobs;
}
