import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class UsersEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({unique: true})
    username: string;

    @Column({nullable: false})
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}