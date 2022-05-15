import faunadb, { query as faunaQuery } from 'faunadb';
import DatabaseInterface from '@lib/database/interface/databaseInterface';
import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';
import { DatabaseSchema } from '@lib/database/classes/faunaFQL/databaseSchema';

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

    private async insertAsync<TEntity>(table: string, data: TEntity): Promise<TEntity | null>
    {
        var response = await this.client.query(
            faunaQuery.Create(
                faunaQuery.Collection(table),
                {
                    data: data
                }
            )
        );
        return response.data || null;
    }

    private async getAsync<TEntity>(primaryKey: string, primaryKeyValue: string): Promise<TEntity | null>
    {
        const response = await this.client.query(
            faunaQuery.Get(
                faunaQuery.Match(
                    faunaQuery.Index(primaryKey),
                    primaryKeyValue
                )
            )
        );
        return response.data || null;
    }

    private async updateAsync<TEntity>(primaryKey: string, primaryKeyValue: string, data: TEntity): Promise<TEntity | null>
    {
        const response = await this.client.Update(
            faunaQuery.Select("ref",
                faunaQuery.Get(
                    faunaQuery.Match(
                        faunaQuery.Index(primaryKey),
                        primaryKeyValue
                    )
                )
            ),
            {
                data: data
            }
        );

        return response.data || null;
    }

    async createDatabase(): Promise<void>
    {
        try
        {

            console.log('# Creating database tables.')

            await this.client.query(
                faunaQuery.CreateCollection({ name: DatabaseSchema.UserAccount.tableName, history_days: null })
            )

            await this.client.query(
                faunaQuery.CreateCollection({ name: DatabaseSchema.Project.tableName, history_days: null })
            )
            await this.client.query(
                faunaQuery.CreateCollection({ name: DatabaseSchema.Post.tableName, history_days: null })
            )
            await this.client.query(
                faunaQuery.CreateCollection({ name: DatabaseSchema.Image.tableName, history_days: null })
            )

            const createPK = (table: string, name: string, column: string): faunadb.Expr =>
            {
                return faunaQuery.CreateIndex({
                    name: name,
                    source: faunaQuery.Collection(table),
                    terms: [{ field: ["data", column] }],
                    unique: true
                })
            }

            await this.client.query(
                createPK(DatabaseSchema.UserAccount.tableName, DatabaseSchema.UserAccount.primarKey.key, DatabaseSchema.UserAccount.primarKey.value)
            )
            await this.client.query(
                createPK(DatabaseSchema.Project.tableName, DatabaseSchema.Project.primarKey.key, DatabaseSchema.Project.primarKey.value)
            )
            await this.client.query(
                createPK(DatabaseSchema.Post.tableName, DatabaseSchema.Post.primarKey.key, DatabaseSchema.Post.primarKey.value)
            )
            await this.client.query(
                createPK(DatabaseSchema.Image.tableName, DatabaseSchema.Image.primarKey.key, DatabaseSchema.Image.primarKey.value)
            )

            console.log('# Tables created.')
        }
        catch (e: any)
        {
            console.log('# Error: ' + e.message)
            throw new Error(e.message);
        }
    }

    async createUser(newUser: DTOs.NewUser): Promise<DTOs.UserDetails | null>
    {
        const user: DatabaseSchema.UserAccount.Entity = {
            DisplayName: newUser.displayName,
            UserName: newUser.userName,
            UserPasswordToken: newUser.userPasswordToken
        };

        const response = await this.insertAsync(DatabaseSchema.UserAccount.tableName, user);

        return response && {
            displayName: response.DisplayName,
            userName: response.UserName
        } || null
    }

    async authenticateUser({ userName, userPasswordToken }: DTOs.AuthCredentials): Promise<DTOs.UserDetails | null>
    {
        const response = await this.getAsync<DatabaseSchema.UserAccount.Entity>(DatabaseSchema.UserAccount.primarKey.key, userName);

        if (!response) return null;

        const user: DatabaseSchema.UserAccount.Entity = {
            DisplayName: response.DisplayName,
            UserName: response.UserName,
            UserPasswordToken: response.UserPasswordToken
        };

        if (user.UserPasswordToken !== userPasswordToken) return null;

        return {
            displayName: user.DisplayName,
            userName: user.UserName
        }
    }

    async createProject({ projectName, accessToken, isActive }: DTOs.NewProject): Promise<DTOs.ProjectDetails | null>
    {
        const project: DatabaseSchema.Project.Entity = {
            ProjectID: await this.client.query(faunaQuery.NewId()),
            ProjectName: projectName,
            AccessToken: accessToken,
            IsActive: isActive
        };

        const response = await this.insertAsync(DatabaseSchema.Project.tableName, project);

        return response && {
            projectID: response.ProjectID,
            projectName: response.ProjectName,
            accessToken: response.AccessToken,
            isActive: response.IsActive
        } || null
    }
}