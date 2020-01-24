import { NextPage } from "next";
import styled from "styled-components";
import Link from "next/link";
import { Question } from "../types/api";
import MainLayout from "../components/MainLayout";
import ApiClient from "../apiClient";

type Props = {
  questions: Question[];
};

const S = {
  H1: styled.h1`
    font-size: 4rem;
  `
};

const Questions: NextPage<Props> = ({ questions }) => {
  return (
    <MainLayout>
      <S.H1>Questions</S.H1>
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
