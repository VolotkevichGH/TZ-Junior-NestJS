import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { PaginationTransformPipe } from '../shared/pipes/paginated.pipe'
import { PaginatedRequestDto, TypeOrmPaginationOptions } from '../shared/schemes/paginated.schemes'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Get()
  findAll(
      @Query(new PaginationTransformPipe()) pagination: PaginatedRequestDto
  ) {
    return this.usersService.findAll(pagination as TypeOrmPaginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id, {relations: ['image']});
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() dto: CreateUserDto,  @UploadedFile() file: Express.Multer.File) {
    dto.image = file;
    return this.usersService.create(dto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  update(@Param('id') id: string,
         @Body() dto: CreateUserDto,
         @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      dto.image = file;
    }
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

}
