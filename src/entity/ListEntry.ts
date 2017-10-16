import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from "typeorm";
import { List } from "./List";

@Entity({
    orderBy: {
        rank: "ASC"
    }
})
export class ListEntry {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    value: string;

    @Column()
    rank: number;

    @Column()
    checked: boolean;

    @Column({ type: "datetime" })
    createdAt: Date;

    @ManyToOne(type => List, list => list.entries,
        { cascadeInsert: true, cascadeUpdate: true }
    )
    list: Promise<List>;

    @BeforeInsert()
    createNewList() {
        this.createdAt = new Date();
    }
}