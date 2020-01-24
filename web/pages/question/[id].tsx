import { NextPage } from "next";

import { Question } from "../../types/api";
import { API_BASE_URL } from "../../config";
import MainLayout from "../../components/MainLayout";

type Props = {
  question: Question;
};

const QuestionPage: NextPage<Props> = ({ question }) => (
  <MainLayout>
    <h1>{question.title}</h1>
    <p>{question.body}</p>
    <ul>
      {question.answers.map(answer => (
        <li>{answer.body}</li>
      ))}
    </ul>
  </MainLayout>
);

QuestionPage.getInitialProps = async ({ query }): Promise<Props> => {
  const res = await fetch(`${API_BASE_URL}/question/${query.id}`);
  const question: Question = await res.json();

  return {
    question
  };
};

export default QuestionPage;
