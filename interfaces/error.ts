export interface ServerErrors {
  errors: Array<ServerError>;
}

export interface ServerError {
  location: string;
  msg: string;
  param: string;
  value: string;
}
