import { AppHttpException } from '../app-http.exception';

export class UserNotFoundAppException extends AppHttpException {
  constructor(userId: string) {
    super(400, 'USER_NOT_FOUND', `User with id ${userId} was not found`, {
      userId,
    });
  }
}
