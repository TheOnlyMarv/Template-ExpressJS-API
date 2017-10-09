import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterLoad, OneToMany, ManyToMany, AfterInsert, Index } from "typeorm";
import { List } from "./List";
import { hashingPassword, generateToken } from "../Utilities";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ type: "datetime" })
    createdAt: Date;

    @Column()
    token: string;

    @ManyToMany(type => List, list => list.users,
        { cascadeInsert: true, cascadeUpdate: true }
    )
    lists: Promise<List[]>;

    @BeforeInsert()
    createNewUser() {
        this.createdAt = new Date();
        this.password = hashingPassword(this.password);
        this.token = generateToken(this.username);
    }

    @AfterInsert()
    @AfterLoad()
    removePassword() {
        this.password = "";
    }
}