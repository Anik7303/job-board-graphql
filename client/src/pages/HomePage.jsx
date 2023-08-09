import { useState } from "react";
import JobList from "../components/JobList";
import PaginationBar from "../components/PaginationBar";
import { useJobs } from "../lib/graphql/hooks";

function HomePage() {
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, loading, error } = useJobs(perPage, (currentPage - 1) * perPage);
  const totalPages = Math.ceil(data?.total / perPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="has-text-danger">Data unavailable</div>;
  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={data?.items} />
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}

export default HomePage;
