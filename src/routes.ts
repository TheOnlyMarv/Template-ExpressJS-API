import { userSaveAction, userGetAllAction, userGetByIdAction, userLoginAction } from "./controller/UserAction";
import { listSaveAction, listGetAllAction, listGetByIdAction, listAssignToUserByIdAction } from "./controller/ListAction";
import { listEntrySaveAction } from "./controller/ListEntryAction";

/**
 * All application routes.
 */
export const AppRoutes = [
    {
        path: "/users",
        method: "get",
        action: userGetAllAction
    },
    {
        path: "/users/:id",
        method: "get",
        action: userGetByIdAction
    },
    {
        path: "/users",
        method: "post",
        action: userSaveAction
    },
    {
        path: "/login",
        method: "get",
        action: userLoginAction
    },
    {
        path: "/lists",
        method: "post",
        action: listSaveAction
    },
    {
        path: "/lists",
        method: "get",
        action: listGetAllAction
    },
    {
        path: "/lists/:id",
        method: "get",
        action: listGetByIdAction
    },
    {
        path: "/lists/:id",
        method: "patch",
        action: listAssignToUserByIdAction
    },
    {
        path: "/lists/:listId/entries",
        method: "post",
        action: listEntrySaveAction
    }
];