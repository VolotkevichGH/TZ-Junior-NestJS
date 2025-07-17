import { NotFoundException } from '@nestjs/common';
import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    RemoveOptions,
    SaveOptions
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseRepository } from './base.repository'
import { BaseEntity } from './base.entity'

export abstract class BaseService<T extends BaseEntity> {
    protected constructor(private readonly repository: BaseRepository<T>) {}

    getRepository() {
        return this.repository;
    }

    createOne(entity: DeepPartial<T>) {
        return this.repository.create(entity);
    }

    saveOne(entity: DeepPartial<T>, options?: SaveOptions) {
        return this.repository.save(entity, options);
    }

    saveMany(entities: T[], options?: SaveOptions & { reload: false }) {
        return this.repository.save(entities, options);
    }

    findOne(options: FindOneOptions<T>) {
        return this.repository.findOne(options);
    }

    async findOneOrFail(options: FindOneOptions<T>) {
        const entity = await this.repository.findOne(options);

        if (!entity) throw new NotFoundException('Entity not found!');

        return entity;
    }

    findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return this.repository.findOneBy(where);
    }

    findOneById(id: string, options?: Omit<FindOneOptions<T>, 'where'>) {
        return this.findOne({
            ...options,
            where: { id } as FindOptionsWhere<T>,
        });
    }

    findMany(options?: FindManyOptions<T>) {
        return this.repository.find(options);
    }

    findManyBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return this.repository.findBy(where);
    }

    findManyAndCount(options?: FindManyOptions<T>) {
        return this.repository.findAndCount(options);
    }

    findManyAndCountBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        options?: Omit<FindManyOptions<T>, 'where'>,
    ) {
        return this.repository.findAndCountBy({ ...options, ...where });
    }

    async findOneOrFailBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        const entity = await this.findOneBy(where);

        if (!entity) throw new NotFoundException('Entity not found!');

        return entity;
    }

    async findOneOrFailById(
        id: string,
        options?: Omit<FindOneOptions<T>, 'where'>,
    ) {
        const entity = await this.findOne({
            ...options,
            where: { id } as FindOptionsWhere<T>,
        });

        if (!entity) throw new NotFoundException('Entity not found!');

        return entity;
    }

    async updateOneOrSaveBy(
        where: FindOptionsWhere<T>,
        entity: T,
        options?: SaveOptions,
    ) {
        const existingEntity = await this.findOne({ where });
        if (!existingEntity) return this.saveOne(entity, options);
        return this.saveOne({ ...existingEntity, ...entity }, options);
    }
 
    async updateOneOrFailById(
        id: string,
        updatePayload: QueryDeepPartialEntity<T>,
    ): Promise<T> {
        const entity = await this.findOneOrFailById(id);

        return this.repository.save({ ...entity, ...updatePayload });
    }

    async updateOneOrFailBy(
        where: FindOptionsWhere<T>,
        updatePayload: QueryDeepPartialEntity<T>,
    ): Promise<T> {
        const entity = await this.findOneOrFailBy(where);

        return this.repository.save({ ...entity, ...updatePayload });
    }

    async updateManyBy(
        where: FindOptionsWhere<T>,
        updatePayload: QueryDeepPartialEntity<T>,
    ) {
        return this.repository.update(where, updatePayload);
    }

    async deleteOneBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        options?: RemoveOptions,
    ) {
        const entity = await this.findOneBy(where);
        if (!entity) return;

        return this.repository.remove(entity, options);
    }

    async deleteOneOrFailBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        options?: RemoveOptions,
    ) {
        const entity = await this.findOneOrFailBy(where);

        return this.repository.remove(entity, options);
    }

    async deleteOneOrFailById(id: string, options?: RemoveOptions) {
        const entity = await this.findOneOrFailById(id);

        return this.repository.remove(entity, options);
    }

    async deleteManyBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        options?: RemoveOptions,
    ) {
        const entities = await this.findManyBy(where);

        return this.repository.remove(entities, options);
    }

    softDeleteManyBy(where: FindOptionsWhere<T>) {
        return this.repository.softDelete(where);
    }
}
