import { NextPage } from "next";
import Link from "next/link";
import { Question } from "../types/api";
import MainLayout from "../components/MainLayout";
import ApiClient from "../apiClient";

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
  const questions = await ApiClient.getQuestions();

  return {
    questions
  };
};

export default Questions;
