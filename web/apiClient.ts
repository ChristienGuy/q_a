import { API_BASE_URL } from "./config";
import { Question } from "./types/api";
import fetch from "isomorphic-unfetch";

class ApiClient {
  static login = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    // TODO: return user or throw with appropriate error
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const { status, statusText } = res;
    const response = await res.json();
    return {
      response,
      status,
      statusText
    };
  };
  static getQuestions = async () => {
    const res = await fetch(`${API_BASE_URL}/question`);
    const questions: Question[] = await res.json();
    return questions;
  };

  static getQuestionById = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/question/${id}`);

    const question: Question = await res.json();
    return question;
  };
}

export default ApiClient;
