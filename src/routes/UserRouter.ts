import { Router, Request, Response, NextFunction } from 'express';


import "reflect-metadata";
import { createConnection } from 'typeorm';
import { User } from '../database/models/User';
import { DbContext } from '../database/DbContext';

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

        let dbUsers = DbContext.getInstance().Users();

        dbUsers.then(async users => {
            res.send(await users.find());
            DbContext.getInstance().CloseConnection();
        }).catch(error => {
            res.status(500).send({ error: 'true', reason: 'DB Error: View log!' })
            DbContext.getInstance().CloseConnection();
        });

    }

    /**
     * GET one User by id
     */
    public getOne(req: Request, res: Response, next: NextFunction) {

        let query = parseInt(req.params.id);

        let dbUsers = DbContext.getInstance().Users();
        dbUsers.then(async users => {
            let user = await users.findOneById(query);
            if (user) {
                res.send(user);
            } else {
                res.status(404).send();
            }
        }).catch(error => {
            res.status(500).send({ error: 'true', reason: 'DB Error: View log!' })
        });
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