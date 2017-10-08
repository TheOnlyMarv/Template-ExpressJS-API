import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { List } from "./List";

@Entity()
export class ListEntry {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @Column()
    rank: number;

    @Column({type: "datetime"})
    createdAt: Date;

    @ManyToOne(type=>List, list => list.entries)
    list: List;

    @BeforeInsert()
    createNewList() {
        this.createdAt = new Date();
    }
}