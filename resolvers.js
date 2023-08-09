import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { toIsoDate } from "./lib/utils.js";

export const resolvers = {
  Query: {
    company: async (_, { id }) => {
      const company = await getCompany(id);
      if (!company) throw notFoundError(`No company with an id of '${id}' found.`);
      return company;
    },
    job: async (_, { id }) => {
      const job = await getJob(id);
      if (!job) throw notFoundError(`No job with an id of '${id}' found.`);
      return job;
    },
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_, { input: { title, description } }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to create jobs.");
      return createJob({ companyId: user.companyId, title, description });
    },
    updateJob: async (_, { input: { id, title, description } }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to update jobs.");
      const job = await updateJob({ id, title, description, companyId: user.companyId });
      if (!job) throw notFoundError(`No job with an id of '${id}' found.`);
      return job;
    },
    deleteJob: async (_, { id }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to delete jobs.");
      const job = await deleteJob(id, user.companyId);
      if (!job) throw notFoundError(`No job with an id of '${id}' found.`);
      return job;
    },
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job, _, { companyLoader }) => companyLoader.load(job.companyId),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

const notFoundError = (message) => new GraphQLError(message, { extensions: { code: "NOT_FOUND" } });
const unauthorizedError = (message) => new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
