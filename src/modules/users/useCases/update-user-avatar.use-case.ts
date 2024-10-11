import { UseCase } from 'src/common/base/use-case';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/users.model';
import { UserNotFoundAppException } from 'src/common/base/exceptions/user/user-not-found.exception';
import { readFileSync } from 'fs';
import { FileUploadService } from '../services/fileupload.service';

export interface IUpdateUserAvatarUseCase {
  execute(data: { id: string; data: Express.Multer.File }): Promise<UserModel>;
}

@Injectable()
export class UpdateUserAvatarUseCase
  extends UseCase<{ id: string; data: Express.Multer.File }, UserModel>
  implements IUpdateUserAvatarUseCase
{
  constructor(private readonly fileUploadService: FileUploadService) {
    super();
  }

  protected async implementation(): Promise<UserModel> {
    const { id, data } = this._input;

    const currentUser = await this._dbContext.userRepository.getOneById(id);

    if (!currentUser) {
      throw new UserNotFoundAppException(id);
    }

    const { destination, filename, mimetype } = data;
    const imagePath = `${destination}/${filename}`;
    const file = readFileSync(imagePath);

    const loadedOriginalFile = await this.fileUploadService.upload(
      file,
      filename,
      mimetype,
    );

    if (loadedOriginalFile?.Location) {
      currentUser.changeAvatar(loadedOriginalFile?.Location);
    }

    const updatedUser = await this._dbContext.userRepository.save(currentUser);

    return updatedUser;
  }
}
