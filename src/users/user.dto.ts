import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { SEX } from '../shared/constants/user.constants'
import { Type } from 'class-transformer'

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    surname: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    address: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: Number })
    @Type(() => Number)
    height: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: Number })
    @Type(() => Number)
    weight: number;

    @IsNotEmpty()
    @IsEnum(SEX)
    @ApiProperty()
    sex: SEX;

    @ApiProperty({
        description: 'Image file for the user',
        type: 'string',
        format: 'binary',
        required: true,
    })
    image: Express.Multer.File;
}

export class UserDto {

    id: number;
    name: string;
    surname: string;
    address: string;
    sex: string;
    weight: number;
    height: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;

}