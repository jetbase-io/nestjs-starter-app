import { Logger, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

//TODO
//Check all .env variables
@Injectable()
export class FileUploadService {
  async upload(file: Buffer, filename: string, mimetype: string) {
    try {
      const bucketS3 = process.env.AWS_BUCKET_NAME;

      return await this.uploadS3(file, bucketS3, filename, mimetype);
    } catch (error) {
      console.error(error);
    }
  }

  async uploadS3(file: Buffer, bucket: string, name: string, mimetype: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION,
      },
    };

    return new Promise<S3.ManagedUpload.SendData & { mimetype: string }>(
      (resolve, reject) => {
        s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
          if (err) {
            Logger.error(err);
            reject(err.message);
          }
          resolve({ ...data, mimetype });
        });
      },
    );
  }

  getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
}
