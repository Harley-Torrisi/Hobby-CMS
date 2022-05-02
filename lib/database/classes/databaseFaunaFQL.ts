import DatabaseInterface from '@lib/database/interface/databaseInterface';
import { DatabaseDTOs as DTOs } from '../interface/databaseDTOs';
import faunadb, { query as faunaQuery } from 'faunadb';
import { DatabaseSchema } from '../interface/databaseSchema';

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
            console.log(`- ${DatabaseSchema.UserAccount.TableName}`)
            await this.client.query(
                faunaQuery.CreateCollection({ name: DatabaseSchema.UserAccount.TableName, history_days: null })
            )
            await this.client.query(
                faunaQuery.CreateIndex({
                    name: DatabaseSchema.UserAccount.PrimaryKeyName,
                    source: faunaQuery.Collection(DatabaseSchema.UserAccount.TableName),
                    terms: [{ field: ["data", DatabaseSchema.UserAccount.Fields.UserName] }],
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

    async createUser(newUser: DTOs.NewUser): Promise<void>
    {
        const user: DatabaseSchema.UserAccount.Entity = {
            UserName: newUser.userName,
            UserPasswordToken: newUser.userPasswordToken,
            IsAdmin: newUser.isAdmin
        };

        await this.client.query(
            faunaQuery.Create(
                faunaQuery.Collection(DatabaseSchema.UserAccount.TableName),
                {
                    data: user
                }
            )
        );
    }

    async authenticateUser({ userName, userPasswordToken }: DTOs.AuthCredentials): Promise<DTOs.UserDetails | null>
    {
        const response = await this.client.query(
            faunaQuery.Get(
                faunaQuery.Match(
                    faunaQuery.Index(DatabaseSchema.UserAccount.PrimaryKeyName),
                    userName
                )
            )
        );

        if (!response.data) return null;

        const user: DatabaseSchema.UserAccount.Entity = {
            UserName: response.data.UserName,
            UserPasswordToken: response.data.UserPasswordToken,
            IsAdmin: response.data.IsAdmin
        };

        if (user.UserPasswordToken !== userPasswordToken) return null;

        return {
            userName: user.UserName,
            isAdmin: user.IsAdmin
        }
    }
}