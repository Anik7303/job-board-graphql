import { useEffect, useState } from "react";
import { getJobs } from "./queries";

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
