export type FormState = {
  email: string;
  password: string;
  nickname: string;
  name: string;
  birth: string;
};

export type FormStatePart = Pick<FormState, 'email' | 'password'>;
