import { NextPage } from "next";
import Link from "next/link";
import MainLayout from "../components/MainLayout";
import Pagination from "../components/Pagination";
import { useQuery } from "@apollo/react-hooks";
import QUESTION_QUERY from "../questions.query";
import { useState } from "react";

const Questions: NextPage = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useQuery(QUESTION_QUERY, {
    variables: {
      page
    }
  });

  const onPaginate = page => {
    setPage(page);
    refetch({
      page
    });
  };

  if (error) {
    return <p>ERROR {JSON.stringify(error)}</p>;
  }
  return (
    <MainLayout>
      <h1>Questions</h1>

      {!loading && (
        <>
          <Pagination
            currentPage={page}
            total={data.questions.total}
            onClick={onPaginate}
          />
          <ul>
            {data.questions.items.map(({ title, body, id }) => (
              <li key={id}>
                <Link href="/question/[id]" as={`/question/${id}`}>
                  <a>
                    <h2>{title}</h2>
                    <p>{body}</p>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </MainLayout>
  );
};

export default Questions;
