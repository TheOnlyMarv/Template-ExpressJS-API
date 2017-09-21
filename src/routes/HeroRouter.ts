import { Router, Request, Response, NextFunction } from 'express';
const Heroes = require('../data.json');


import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from '../models/User';

export class HeroRouter {
    router: Router

    /**
     * Initialize the HeroRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET all Heroes.
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
            //console.log(connection);
            let users = await connection.manager.find(User);
            res.status(200).send(users);
            // Here you can start to work with your entities
            connection.close();
        }).catch(error => {console.log(error); res.send(error)});
    }

    /**
     * GET one hero by id
     */
    public getOne(req: Request, res: Response, next: NextFunction) {
        let query = parseInt(req.params.id);
        let hero = Heroes.find(hero => hero.id === query);
        if (hero) {
            res.status(200)
                .send({
                    message: 'Success',
                    status: res.status,
                    hero
                });
        }
        else {
            res.status(404)
                .send({
                    message: 'No hero found with the given id.',
                    status: res.status
                });
        }
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
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;