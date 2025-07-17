import { Readable } from 'node:stream';

import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsCommand,
    ObjectCannedACL,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import configuration from '../config/configuration'
import * as mime from 'mime-types';
import { createHashSync } from '../shared/utils/encryption'

export type AwsUploadOptions = {
  bucket: string
  folder: string
  acl?: ObjectCannedACL | undefined
};

@Injectable()
export class AwsStorageClientService {
  private client: S3Client;

  constructor() {
      const accessKeyId = configuration().aws.accessKeyId;
      const secretAccessKey = configuration().aws.secretAccessKey;
      const region = configuration().aws.region;
      const endpoint = configuration().aws.endpoint;

      this.client = new S3Client({
          endpoint: endpoint,
          forcePathStyle: false,
          region: region,
          credentials: {
              accessKeyId: accessKeyId,
              secretAccessKey: secretAccessKey
          }
      });
  }

  async uploadOneFromFile(file: Express.Multer.File, options: AwsUploadOptions) {
      const hash = createHashSync(file.buffer);

      const key = options.folder ? `${options.folder}/${hash}` : hash;
      const path = options.bucket ? `/${options.bucket}/${key}` : key;

      const fileMimeType = mime.lookup(file.filename || file.originalname);
      const fileExtension = mime.extension(fileMimeType || file.mimetype);

      const command = new PutObjectCommand({
          Bucket: options.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: options.acl,

          Metadata: {
              'x-amz-meta-my-key': file.originalname,
          },
      });

      await this.client.send(command);

      return {
          hash,
          bucket: options.bucket,
          folder: options.folder,
          fileName: `${hash}.${fileExtension}`,
          originalName: file.originalname,
          mimeType: file.mimetype,
          baseUrl: configuration().aws.endpoint,
          path,
      };
  }

  async getOneByKeyAndBucket(path: string, bucket: string) {
      const command = new GetObjectCommand({
          Bucket: bucket,
          Key: path,
      });

      const response = await this.client.send(command);

      if (!response.Body) throw new NotFoundException();

      return response.Body as Readable;
  }

  async deleteOneByKeyAndBucket(path: string, bucket: string) {
      const command = new DeleteObjectCommand({
          Bucket: bucket,
          Key: path,
      });

      const result = await this.client.send(command);

      return result.DeleteMarker;
  }

  async deleteManyByFolderAndBucket(path: string, bucket: string) {
      const listObjectCommand = new ListObjectsCommand({
          Bucket: bucket,
          Prefix: path,
      });

      const listObjectResult = await this.client.send(listObjectCommand);

      if (!listObjectResult.Contents || listObjectResult.Contents.length === 0) return;

      const listObjectToDelete = listObjectResult.Contents.map((item) => ({ Key: item.Key }));

      const deleteObjectCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: listObjectToDelete },
      });

      const result = await this.client.send(deleteObjectCommand);

      return result.Deleted;
  }
}
