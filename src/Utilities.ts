import { Md5 } from "ts-md5/dist/md5";
import { User } from "./entity/User";
import { Repository } from "typeorm";

const passwordSalt: string = 'tKL8HnLpnQYFU40yK5rW';

export function hashingPassword(password: string): string {
    let md5 = new Md5();
    return String(md5.appendStr(password).appendStr(passwordSalt).end());
}

export function generateToken(username: string): string {
    let md5 = new Md5();
    return String(md5.appendStr(username).appendStr(new Date().toJSON()).end());
}

export async function getUserForToken(token: String, userRepository: Repository<User>): Promise<User> {
    if (!token || !userRepository) {
        return null;
    }
    return await userRepository.findOne({ where: { token: token } });
}

export function deleteUnsafeInformation(users: User[]) {
    if (users) {
        users.forEach(user => { user.token = ""; user.password = "" });
    }
}