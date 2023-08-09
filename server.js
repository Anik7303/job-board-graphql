import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { authMiddleware, handleLogin } from "./auth.js";
import { createCompanyLoader } from "./db/companies.js";
import { getUser } from "./db/users.js";
import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 9000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post("/login", handleLogin);

async function getContext({ req }) {
  const context = {
    companyLoader: createCompanyLoader(),
  };
  if (req.auth) {
    const user = await getUser(req.auth.sub);
    if (user) context.user = user;
  }
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
