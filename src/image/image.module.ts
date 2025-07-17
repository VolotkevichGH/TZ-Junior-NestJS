import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service'
import { AwsStorageClientModule } from '../aws-storage/aws-storage-client.module'
import { ImageEntity } from './image.entity'

@Module({
    imports: [ TypeOrmModule.forFeature([ ImageEntity ]), AwsStorageClientModule ],
    providers: [ ImageService ],
    exports: [ ImageService  ]
})
export class ImageModule {}
