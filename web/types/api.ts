export type User = {
  id: number;
  email: string;
  username: string;
  questions?: Question[];
  answers?: Answer[];
};

export type Answer = {
  body: string;
  createdAt: Date;
  user: User;
};

export type Question = {
  title: string;
  body: string;
  id: number;
  answers: Answer[];
};
