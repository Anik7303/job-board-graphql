import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { authMiddleware, handleLogin } from "./auth.js";
import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

async function getContext() {
  const context = {};
  return context;
}

const typeDefs = (await fs.readFile(path.resolve("schema.graphql"))).toString();
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use(apolloMiddleware(server, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server address: http://localhost:${PORT}`);
  console.log(`Graphql endpoint: http://localhost:${PORT}/graphql`);
});
