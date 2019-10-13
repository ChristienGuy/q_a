import { NextPage } from "next";
import { Question } from "../../types/api";

type Props = {
  question: Question;
};

const QuestionPage: NextPage<Props> = ({ question }) => (
  <div>{JSON.stringify(question)}</div>
);

QuestionPage.getInitialProps = async ({ query }): Promise<Props> => {
  const res = await fetch(`http://localhost:8888/question/${query.id}`);
  const question = await res.json();

  return {
    question
  };
};

export default QuestionPage;
