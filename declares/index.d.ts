import { ServerError, ServerErrors } from './../interfaces/error';

declare global {
  interface Error {
    response?: {
      data?: ServerErrors | Pick<ServerError, 'msg'>;
    };
  }
}
