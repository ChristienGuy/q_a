import { NextPage } from "next";
import MainLayout from "../../components/MainLayout";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

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

const ADD_ANSWER_MUTATION = gql`
  mutation AddAnswer($answer: AnswerInput!) {
    addAnswer(answer: $answer) {
      id
    }
  }
`;

const QuestionPage: NextPage<Props> = ({ questionId }) => {
  const { data, loading, error, refetch } = useQuery(QUESTION_QUERY, {
    variables: {
      questionId
    }
  });

  const [addAnswer] = useMutation(ADD_ANSWER_MUTATION);

  const submitAnswerForm = async e => {
    e.preventDefault();

    const answer = {
      questionId,
      body: e.target.body.value
    };

    await addAnswer({
      variables: {
        answer
      }
    });

    await refetch();
  };

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

      <form onSubmit={submitAnswerForm}>
        <label>
          Answer:
          <input type="text" placeholder="body" name="body" />
        </label>
        <input type="submit" value="add answer" />
      </form>
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
