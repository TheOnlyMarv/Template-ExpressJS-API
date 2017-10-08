import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import { hashingPassword } from "../Utilities";

/**
 * Saves given user.
 */
export async function userSaveAction(request: Request, response: Response) {

    // get a user repository to perform operations with user
    const userRepository = getManager().getRepository(User);

    if (request.body.username && request.body.password) {
        // create a real user object from user json object sent over http
        const newUser = userRepository.create(request.body);

        // save received user
        await userRepository.save(newUser)
            .catch(error => {
                response.status(409).send("User already exists!");
            });

        // return saved user back
        response.send(newUser);
    } else {
        response.sendStatus(400);
        return;
    }

}

/**
 * Loads all users from the database.
 */
export async function userGetAllAction(request: Request, response: Response) {

    // get a user repository to perform operations with user
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const users = await userRepository.find();

    // delete token vor all users
    deleteUnsafeInformation(users);

    // return loaded users
    response.send(users);
}

/**
 * Loads user by a given id.
 */
export async function userGetByIdAction(request: Request, response: Response) {

    // get a user repository to perform operations with user
    const userRepository = getManager().getRepository(User);

    // load a user by a given user id
    const user = await userRepository.findOneById(request.params.id);

    // if user was not found return 404 to the client
    if (!user) {
        response.status(404);
        response.end();
        return;
    }

    // delete token vor all users
    deleteUnsafeInformation([user]);

    // return loaded user
    response.send(user);
}

/**
 * User login by username and password as BASIC Auth
 */
export async function userLoginAction(request: Request, response: Response) {
    var auth = require('basic-auth');
    var credentials = auth(request);

    if (!credentials) {
        response.setHeader('WWW-Authenticate', 'Basic realm="example"');
        response.status(401).send("Access denied");
        return;
    }

    const username: string = credentials.name;
    const password: string = hashingPassword(credentials.pass);

    const userRepository = getManager().getRepository(User);

    const user = await userRepository.findOne({ where: { username: username, password: password } });

    if (!user) {
        response.status(401).send("Access denied");
        return;
    }

    response.send(user);
}

function deleteUnsafeInformation(users: User[]) {
    if (users) {
        users.forEach(user => { user.token = ""; user.password = "" });
    }
}