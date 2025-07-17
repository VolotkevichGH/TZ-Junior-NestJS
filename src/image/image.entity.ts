import { Column, Entity, Index } from 'typeorm'
import { BaseEntity } from '../shared/base/base.entity'

@Entity({ name: 'images' })
@Index([ 'hash', 'path' ], { unique: true })
export class ImageEntity extends BaseEntity {

    @Column()
    imageLink!: string;

    @Column({ nullable: true })
    hash!: string;

    @Column({ nullable: true })
    mimeType!: string;

    @Column({ nullable: true })
    path!: string;

    @Column({ nullable: true })
    bucket!: string;

}