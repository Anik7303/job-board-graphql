import { useMutation, useQuery } from "@apollo/client";
import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from "./queries";

export function useJobs(limit, offset = 0) {
  const variables = { offset };
  if (limit) variables.limit = limit;
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
    variables,
  });
  return { data: data?.jobs, loading, error };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, { variables: { id } });
  return { job: data?.job, loading, error };
}

export function useCompany(id) {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });
  return { company: data?.company, loading, error };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(createJobMutation);

  const createJob = async ({ title, description }) => {
    const { data } = await mutate({
      variables: { input: { title, description } },
    });
    return data?.job;
  };

  return { createJob, loading, error };
}
