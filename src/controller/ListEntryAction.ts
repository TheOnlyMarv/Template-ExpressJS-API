import { Response, Request } from "express";

export async function listEntrySaveAction(request: Request, response: Response) {
    const listId = request.params.listId;

    if (!listId) {
        response.sendStatus(400);
    }
}