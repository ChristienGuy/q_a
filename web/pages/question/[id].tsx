import { NextPage } from "next";
import MainLayout from "../../components/MainLayout";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

type Props = {
  questionId: number;
};

const QUESTION_QUERY = gql`
  query Question($questionId: Int!) {
    question(questionId: $questionId) {
      body
      title
      answers {
        items {
          body
          user {
            username
          }
        }
      }
    }
  }
`;

const QuestionPage: NextPage<Props> = ({ questionId }) => {
  const { data, loading, error } = useQuery(QUESTION_QUERY, {
    variables: {
      questionId
    }
  });

  if (loading) {
    return <p>loading...</p>;
  }
  if (error) {
    return <p>error: {JSON.stringify(error)}</p>;
  }
  return (
    <MainLayout>
      <h1>{data.question.title}</h1>
      <p>{data.question.body}</p>
      <ul>
        {data.question.answers.items.map(answer => (
          <li>{answer.body}</li>
        ))}
      </ul>
    </MainLayout>
  );
};

QuestionPage.getInitialProps = async ({ query }): Promise<Props> => {
  return {
    // TODO: coerce this to a number correctly
    questionId: +query.id
  };
};

export default QuestionPage;
