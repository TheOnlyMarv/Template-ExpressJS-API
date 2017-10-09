import { Request, Response } from "express";
import { getManager } from "typeorm";
import { List } from "../entity/List";
import { User } from "../entity/User";
import { getUserForToken, deleteUnsafeInformation } from "../Utilities";

/**
 * Saves given list.
 */
export async function listSaveAction(request: Request, response: Response) {

    const user = await getUserForToken(request.header("X-Auth-Token"), getManager().getRepository(User));

    if (!user) {
        response.status(401).send('Access denied');
        return;
    }

    if (!request.body.name) {
        response.sendStatus(400);
        return;
    }

    const listRepository = getManager().getRepository(List);
    let newList = listRepository.create();

    newList.name = request.body.name;

    newList.users = Promise.resolve([user]);

    newList = await listRepository.save(newList);

    response.status(201).send(newList);
}

/**
 * Loads all lists from current user.
 */
export async function listGetAllAction(request: Request, response: Response) {

    const user = await getUserForToken(request.header("X-Auth-Token"), getManager().getRepository(User));

    if (!user) {
        response.status(401).send('Access denied');
        return;
    }

    const list = await user.lists;


    response.send(await user.lists);
}


/**
 * Loads all lists by id user.
 */
export async function listGetByIdAction(request: Request, response: Response) {

    const user = await getUserForToken(request.header("X-Auth-Token"), getManager().getRepository(User));

    if (!user) {
        response.status(401).send('Access denied');
        return;
    }

    const listsFromUser = await user.lists;

    const list = listsFromUser.find(x => {
        return x.id === +(request.params.id) || x.publicLink === String(request.params.id)
    });

    if (!list) {
        response.sendStatus(404);
        return;
    }

    await list.entries;

    deleteUnsafeInformation(await list.users);

    response.send(list);
}

/**
 * Loads all lists by id user.
 */
export async function listAssignToUserByIdAction(request: Request, response: Response) {

    const user = await getUserForToken(request.header("X-Auth-Token"), getManager().getRepository(User));

    if (!user) {
        response.status(401).send('Access denied');
        return;
    }
    const userLists = await user.lists;

    const listRepo = getManager().getRepository(List);

    let list = await listRepo.createQueryBuilder('list')
        .where("list.id = :id", { id: request.params.id })
        .orWhere("list.publicLink = :pL", { pL: String(request.params.id) }).getOne();

    if (!list) {
        response.sendStatus(404);
        return;
    }

    if (userLists.find(x => x.id === list.id)) {
        response.status(409).send("Already linked to this list");
        return;
    }

    const listUsers = await list.users;
    listUsers.push(user);

    
    list = await listRepo.save(list)
    deleteUnsafeInformation(await list.users);

    response.send(list);
}

