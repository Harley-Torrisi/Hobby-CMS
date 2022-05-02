import DatabaseInterface from '@lib/database/interface/databaseInterface';
import { DatabaseTableNames as TableNames } from '@lib/database/interface/databaseTableNames'
import { DatabaseDTOs as DTOs } from '../interface/databaseDTOs';
import faunadb from 'faunadb';
const faunaQuery = faunadb.query;

export default class DatabaseFaunaFQL implements DatabaseInterface
{
    client: any;
    databaseName: string;

    constructor(
        secret: string,
        domain: string,
        port: number,
        scheme: "http" | "https" | undefined,
        databaseName: string
    )
    {
        this.client = new faunadb.Client({
            secret: secret,
            domain: domain,
            port: port,
            scheme: scheme,
        });

        this.databaseName = databaseName;
    }

    async createDatabase(): Promise<void>
    {
        try
        {

            console.log('# Creating database tables.')
            console.log(`- ${TableNames.userAccount}`)
            await this.client.query(
                faunaQuery.CreateCollection({ name: TableNames.userAccount, history_days: null })
            )
            await this.client.query(
                faunaQuery.CreateIndex({
                    name: `${TableNames.userAccount}_PK`,
                    source: faunaQuery.Collection(TableNames.userAccount),
                    terms: [{ field: ["data", "id"] }],
                    unique: true
                })
            )


            console.log('# Tables created.')
        }
        catch (e: any)
        {
            throw new Error('# Error: ' + e.message);
        }
    }

    async createUser(newUser: DTOs.NewUser): Promise<string>
    {
        await this.client.query(
            faunaQuery.Create(
                faunaQuery.Collection(TableNames.userAccount),
                {
                    data: {
                        id: 1,
                        userName: newUser.userName,
                        password: newUser.userPassword,
                        isAdmin: newUser.isAdmin
                    }
                }
            )
        );

        return 'not implemented';
    }
}