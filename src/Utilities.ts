import { Md5 } from "ts-md5/dist/md5";

const passwordSalt: string = 'tKL8HnLpnQYFU40yK5rW';

export function hashingPassword(password: string): string {
    let md5 = new Md5();
    return String(md5.appendStr(password).appendStr(passwordSalt).end());
}

export function generateToken(username: string): string{
    let md5 = new Md5();
    return String(md5.appendStr(username).appendStr(new Date().toJSON()).end());
}