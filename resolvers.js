import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { toIsoDate } from "./lib/utils.js";

export const resolvers = {
  Query: {
    company: (_, { id }) => getCompany(id),
    job: (_, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_, { input: { title, description } }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to create jobs.");
      return createJob({ companyId: user.companyId, title, description });
    },
    updateJob: (_, { input: { id, title, description } }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to update jobs.");
      return updateJob({ id, title, description });
    },
    deleteJob: (_, { id }, { user }) => {
      if (!user) throw unauthorizedError("You are not authorized to delete jobs.");
      return deleteJob(id);
    },
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};

const unauthorizedError = (message) => new GraphQLError(message, { extensions: { code: "UNAUTHORIZED" } });
