import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { BaseService } from '../shared/base/base.service'
import { UsersRepository } from './users.repository'
import { CreateUserDto, UserDto } from './user.dto'
import { ImageService } from '../image/image.service'
import { Bucket, Folder } from '../shared/constants/aws.constants'
import { TypeOrmPaginationOptions } from '../shared/schemes/paginated.schemes'

@Injectable()
export class UsersService extends BaseService<UserEntity>{
    constructor(@InjectRepository(UserEntity)private readonly userRepository: UsersRepository,
                private readonly imageService: ImageService,) {
        super(userRepository)
    }


    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        const { image, ...dto } = createUserDto;
        const existsUser = await this.findOne({
            where: {
                name: createUserDto.name,
                surname: createUserDto.surname,
            }
        })
        if (existsUser) throw new BadRequestException('User already exists')
        const user = this.createOne(dto);
        user.image = await this.imageService.uploadImage(image, {
            bucket: Bucket.TZ,
            folder: Folder.USERS,
            acl: 'public-read'
        })
        return this.saveOne(user);
    }

    async update(id: string, dto: CreateUserDto): Promise<UserEntity> {
        const user = await this.findOne({
            where: {
                id
            },
            relations: ['image']
        })
        if (!user) throw new BadRequestException('User not found');
        const conflict = await this.findOne({
            where: {
                name: dto.name,
                surname: dto.surname,
            }
        })
        if (conflict && conflict.id !== id) throw new BadRequestException('User already exists');
        user.name = dto.name;
        user.surname = dto.surname;
        user.sex = dto.sex;
        user.address = dto.address;
        user.height = dto.height;
        user.weight = dto.weight;

        if (dto.image) {
            await this.imageService.deleteImage(user.image.id);
            user.image = await this.imageService.uploadImage(dto.image, {
                bucket: Bucket.TZ,
                folder: Folder.USERS,
                acl: 'public-read'
            })
        }
        return this.saveOne(user);
    }

    async findAll(pagination: TypeOrmPaginationOptions) {
        const qb = this.userRepository.createQueryBuilder('users');
        return  qb.select(['users.id', 'users.name', 'users.surname', 'users.address',
        'users.sex', 'users.weight', 'users.height', 'image.imageLink AS image', 'users.createdAt', 'users.updatedAt'])
            .limit(pagination.limit)
            .offset(pagination.offset)
            .orderBy('users.createdAt', 'DESC')
            .leftJoin('users.image', 'image')
            .groupBy('users.id, users.name, users.surname, ' +
                'users.address, users.sex, users.weight, users.height, ' +
                'users.createdAt, users.updatedAt, image.imageLink')
            .getRawMany<UserDto>();
    }

    async delete(id: string): Promise<{success: boolean}> {
        const user = await this.findOne({
            where: {
                id: id
            },
            relations: ['image']
        })
        if (!user) throw new BadRequestException('User not found');
        if (user.image) {
            await this.imageService.deleteImage(user.image.id);
        }
       await this.deleteOneBy({id})
        return { success: true }
    }
}
