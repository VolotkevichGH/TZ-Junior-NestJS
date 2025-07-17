import { Module } from '@nestjs/common';
import { AwsStorageClientService } from './aws-storage-client.service'

@Module({
    imports: [ ],
    providers: [ AwsStorageClientService ],
    exports: [ AwsStorageClientService  ]
})
export class AwsStorageClientModule {}
