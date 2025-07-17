import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { ImageModule } from '../image/image.module'

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
      ImageModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
