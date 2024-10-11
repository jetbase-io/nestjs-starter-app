import { AppHttpException } from '../app-http.exception';

export class UserAlreadyExistsAppException extends AppHttpException {
  constructor(username: string) {
    super(
      400,
      'USER_ALREADY_EXISTS',
      `User with username ${username} already exists`,
      { username },
    );
  }
}
