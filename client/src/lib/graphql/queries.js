import { GraphQLClient } from "graphql-request";

// backend server url for graphql
const url = "http://localhost:9000/graphql";

const client = new GraphQLClient(url);
