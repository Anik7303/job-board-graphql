import { useEffect, useState } from "react";
import { getCompany, getJob, getJobs } from "./queries";

export function useJobs() {
  const [state, setState] = useState({ jobs: null, loading: true, error: false });

  useEffect(() => {
    try {
      (async () => {
        const jobs = await getJobs();
        setState({ jobs, loading: false, error: false });
      })();
    } catch {
      setState({ jobs: null, loading: false, error: true });
    }
  }, []);

  return state;
}

export function useJob(id) {
  const [state, setState] = useState({ job: null, loading: true, error: false });

  useEffect(() => {
    try {
      (async () => {
        const job = await getJob(id);
        setState({ job, loading: false, error: false });
      })();
    } catch {
      setState({ job: null, loading: false, error: true });
    }
  }, [id]);

  return state;
}

export function useCompany(id) {
  const [state, setState] = useState({ company: null, loading: true, error: false });

  useEffect(() => {
    try {
      (async () => {
        const company = await getCompany(id);
        setState({ company, loading: false, error: false });
      })();
    } catch {
      setState({ company: null, loading: false, error: true });
    }
  }, [id]);

  return state;
}
