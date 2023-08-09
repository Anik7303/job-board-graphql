import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
import { toIsoDate } from "./lib/utils.js";

export const resolvers = {
  Query: {
    job: (_, { id }) => getJob(id),
    jobs: () => getJobs(),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
};
