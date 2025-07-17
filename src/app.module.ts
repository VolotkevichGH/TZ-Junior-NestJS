import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ImageModule } from './image/image.module'
import { AwsStorageClientModule } from './aws-storage/aws-storage-client.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
    type: 'postgres',
    database: configuration().database.name,
    username: configuration().database.username,
    password: configuration().database.password,
    host: configuration().database.host,
    port: configuration().database.port,
    synchronize: true,
    autoLoadEntities: true,
  }),
    UsersModule,
  ImageModule,
  AwsStorageClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
