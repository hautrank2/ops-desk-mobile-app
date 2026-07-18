export type SigninModel = {
  username: string;
  password: string;
};

export type SigninResponseModel = {
  _id: string;
  username: string;
  role: string;
  token: string;
};
