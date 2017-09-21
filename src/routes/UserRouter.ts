import { Router, Request, Response, NextFunction } from 'express';


import "reflect-metadata";
import { createConnection } from 'typeorm';
import { User } from '../models/User';

export class UserRouter {
    router: Router

    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET all Users.
     */
    public getAll(req: Request, res: Response, next: NextFunction) {
        //res.send(Heroes);
        createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "todo",
            entities: [
                User
            ],
            autoSchemaSync: true,
        }).then(async connection => {
            // Here you can start to work with your entities
            let users = await connection.manager.find(User);
            res.send(users);
            connection.close();
        }).catch(error => { console.log(error); res.send(error) });
    }

    /**
     * GET one User by id
     */
    public getOne(req: Request, res: Response, next: NextFunction) {
        let query = parseInt(req.params.id);
        createConnection({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "todo",
            entities: [
                User
            ],
            autoSchemaSync: true,
        }).then(async connection => {
            // Here you can start to work with your entities
            let users = await connection.manager.find(User);
            res.send(users.find(x => x.id == query));
            connection.close();
        }).catch(error => { console.log(error); res.send(error) });
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
    }

}

// Create the HeroRouter, and export its configured Express.Router
const userRoutes = new UserRouter();
userRoutes.init();

export default userRoutes.router;