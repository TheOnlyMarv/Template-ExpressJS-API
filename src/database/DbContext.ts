import { User } from "./models/User";
import "reflect-metadata";
import { createConnection, ConnectionOptions, Repository, Connection } from 'typeorm';

export class DbContext {

    private static instance: DbContext;

    private constructor() { DbContext.instance = this; }

    public static getInstance(): DbContext {
        if (!DbContext.instance) {
            DbContext.instance = new DbContext();
        }
        if (!DbContext.instance.connection) {
            DbContext.instance.connection = createConnection(DbContext.connectionData)
                .then(async connection => connection);
        }
        return DbContext.instance;
    }

    private static connectionData: ConnectionOptions = {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "",
        database: "todo",
        entities: [
            __dirname + "/models/*.js"
        ],
        autoSchemaSync: true,
    };

    private connection: Promise<Connection>;

    public CloseConnection() {
        if (this.connection) {
            this.connection.then(connection => {
                connection.close(); this.connection = null;
            });
        }
    }

    public Users(): Promise<Repository<User>> {
        return this.connection.then(conntection => conntection.getRepository(User));
    }


}