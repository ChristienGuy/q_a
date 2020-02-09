import { NextPage } from "next";
import Link from "next/link";
import MainLayout from "../components/MainLayout";
import { useQuery } from "@apollo/react-hooks";
import QUESTION_QUERY from "../questions.query";
import { withApollo } from "../apollo";

const Questions: NextPage = () => {
  const { data, loading, error } = useQuery(QUESTION_QUERY);

  if (loading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p>ERROR {JSON.stringify(error)}</p>;
  }
  return (
    <MainLayout>
      <h1>Questions</h1>
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
    </MainLayout>
  );
};

export default Questions;
