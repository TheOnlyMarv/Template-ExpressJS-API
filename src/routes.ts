import { userSaveAction, userGetAllAction, userGetByIdAction, userLoginAction } from "./controller/UserAction";

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
    }

];