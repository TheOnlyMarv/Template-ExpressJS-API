import { PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne, ManyToMany, JoinTable, Entity, OneToMany } from "typeorm";
import { Md5 } from "ts-md5/dist/md5";
import { User } from "./User";
import { ListEntry } from "./ListEntry";

@Entity()
export class List {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    publicLink: string;

    @Column({ type: "datetime" })
    createdAt: Date;

    @ManyToMany(type => User, user=>user.lists)
    @JoinTable()
    users: User[];

    @OneToMany(type => ListEntry, listEntry => listEntry.list)
    @JoinTable()
    entries: ListEntry[]

    @BeforeInsert()
    createNewList() {
        this.createdAt = new Date();
        let md5 = new Md5();
        this.publicLink = String(md5.appendStr(this.name).appendStr(this.createdAt.toJSON()).end());
    }
}