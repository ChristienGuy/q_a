import { NextPage, NextPageContext } from "next";

import { Question } from "../../types/api";
import MainLayout from "../../components/MainLayout";
import ApiClient from "../../apiClient";

const QuestionsPage: NextPage<{
  questions: Question[];
}> = ({ questions }) => (
  <MainLayout>
    <ul>
      {questions.map(question => (
        <li>{question.title}</li>
      ))}
    </ul>
  </MainLayout>
);

QuestionsPage.getInitialProps = async (context: NextPageContext) => {
  const questions = await ApiClient.getQuestions();

  return {
    questions
  };
};

export default QuestionsPage;
