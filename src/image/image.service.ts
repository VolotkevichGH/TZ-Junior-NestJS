import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity'
import { BaseService } from '../shared/base/base.service'
import { AwsStorageClientService, AwsUploadOptions } from '../aws-storage/aws-storage-client.service'
import { ImageRepository } from './image.repository'


@Injectable()
export class ImageService extends BaseService<ImageEntity> {
    constructor(@InjectRepository(ImageEntity) private readonly imageRepository: ImageRepository,
                private readonly awsStorageClientService: AwsStorageClientService,) {
        super(imageRepository);
    }

    async uploadImage(file: Express.Multer.File, options: AwsUploadOptions) {
        const uploadResult = await this.awsStorageClientService.uploadOneFromFile(file, options);

        const existingImage = await this.findOne({ where: { hash: uploadResult.hash } });
        if (existingImage) {
            await this.awsStorageClientService.deleteOneByKeyAndBucket(uploadResult.path, uploadResult.bucket);
            return existingImage;
        }

        const newImage = this.createOne({
            imageLink: uploadResult.baseUrl + uploadResult.path,
            hash: uploadResult.hash,
            mimeType: uploadResult.mimeType,
            path: uploadResult.path,
            bucket: uploadResult.bucket,
        });

        return this.saveOne(newImage);
    }

    async getImage(imageId: string) {
        const image = await this.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException(`Image with ID ${imageId} not found`);
        }

        const fileStream = await this.awsStorageClientService.getOneByKeyAndBucket(image.path, image.bucket);
        return { fileStream, mimeType: image.mimeType };
    }

    async deleteImage(imageId: string) {
        const imageToDelete = await this.findOne({ where: { id: imageId } });
        if (!imageToDelete) {
            throw new NotFoundException(`Image with ID ${imageId} not found`);
        }

        try {
            await this.awsStorageClientService.deleteOneByKeyAndBucket(imageToDelete.path, imageToDelete.bucket);
        } catch (error) {
            console.error(`Failed to delete image from S3: ${error.message}`);
        }

        return this.imageRepository.delete(imageId);
    }
}
