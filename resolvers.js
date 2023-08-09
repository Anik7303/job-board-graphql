import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";
import { toIsoDate } from "./lib/utils.js";

export const resolvers = {
  Query: {
    jobs: () => getJobs(),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};
