import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

export class PaginatedRequestDto {
    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    size?: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    page?: number;
}

export class TypeOrmPaginationOptions {
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    limit: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    @Expose()
    offset: number;
}