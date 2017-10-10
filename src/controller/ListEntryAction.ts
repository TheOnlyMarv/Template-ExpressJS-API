import { Response, Request } from "express";
import { User } from "../entity/User";
import { List } from "../entity/List";
import { getUserForToken } from "../Utilities";
import { getManager } from "typeorm";
import { ListEntry } from "../entity/ListEntry";

export async function listEntrySaveAction(request: Request, response: Response) {
    const listId = request.params.listId;

    if (!listId) {
        response.sendStatus(400);
        return;
    }

    const user = await getUserForToken(request.header("X-Auth-Token"), getManager().getRepository(User));
    let list = await getManager().getRepository(List).findOneById(listId);
    list = await hasAccessToGivenList(list, user);

    if (!list) {
        response.status(401).send('Access denied');
        return;
    }

    const listEntryRepo = getManager().getRepository(ListEntry);
    const newListEntries = listEntryRepo.create(request.body);
    newListEntries.forEach(entry => {
        entry.list = Promise.resolve(list);
    });

    response.sendStatus(201).send(await listEntryRepo.save(newListEntries));

}

async function hasAccessToGivenList(list: List, user: User): Promise<List> {
    if (list && user) {
        const listUsers = await list.users;
        const userId = user.id;
        if (listUsers.find(x => x.id === userId)) {
            return list;
        }
    }
    return null;
}