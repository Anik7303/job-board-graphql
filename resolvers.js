import { getCompany } from "./db/companies.js";
import { createJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";
import { toIsoDate } from "./lib/utils.js";

export const resolvers = {
  Query: {
    company: (_, { id }) => getCompany(id),
    job: (_, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: (_, { input: { title, description } }, { user }) =>
      createJob({ companyId: user.companyId, title, description }),
    updateJob: (_, { input: { id, title, description } }) => updateJob({ id, title, description }),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};
