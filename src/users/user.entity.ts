import { SEX } from '../shared/constants/user.constants'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../shared/base/base.entity'
import { ImageEntity } from '../image/image.entity'

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column()
    name: string

    @Column()
    surname: string

    @Column()
    height: number

    @Column()
    weight: number

    @Column({ enum: SEX, type: 'enum' })
    sex: SEX

    @OneToOne(() => ImageEntity, { onDelete: 'SET NULL', onUpdate: 'SET NULL' })
    @JoinColumn({ name: 'image_id' })
    image: ImageEntity

    @Column()
    address: string

}