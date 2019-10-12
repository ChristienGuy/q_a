import MainLayout from "../../components/MainLayout";
import { useEffect, useState } from "react";

type Question = {
  body: string;
  id: number;
};

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch("http://localhost:8888/question")
      .then(res => res.json())
      .then(json => setQuestions(json));
  }, []);

  return (
    <MainLayout>
      <h1>Questions</h1>
      <ul>
        {questions.map(({ body, id }) => (
          <li key={id}>{body}</li>
        ))}
      </ul>
    </MainLayout>
  );
};

export default Questions;
