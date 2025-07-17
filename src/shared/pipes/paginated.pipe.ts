import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { TypeOrmPaginationOptions } from '../schemes/paginated.schemes'

@Injectable()
export class PaginationTransformPipe implements PipeTransform {
    private readonly size: number;
    constructor(size: number = 10) {
        this.size = size;
    }

    async transform(dto: Record<string, number>, { metatype }: ArgumentMetadata) {
        if (!metatype) {
            return dto;
        }
        dto.page = dto.page ? dto.page : 1;
        dto.size = dto.size ? dto.size : this.size;
        dto.limit = dto.size;
        dto.offset = dto.page * dto.limit - dto.limit;
        return plainToInstance(TypeOrmPaginationOptions, dto, { excludeExtraneousValues: true });
    }
}