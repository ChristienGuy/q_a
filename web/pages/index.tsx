import Link from "next/link";
import { NextPage } from "next";
import fetch from "isomorphic-unfetch";

import { Question } from "../types/api";
import MainLayout from "../components/MainLayout";

type Props = {
  questions: Question[];
};

const Questions: NextPage<Props> = ({ questions }) => {
  return (
    <MainLayout>
      <h1>Questions</h1>
      <ul>
        {questions.map(({ title, body, id }) => (
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

Questions.getInitialProps = async (): Promise<Props> => {
  const res = await fetch("http://localhost:8888/question");
  const questions: Question[] = await res.json();

  return {
    questions
  };
};

export default Questions;
