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

    private async getAllAsync<TEntity>(tableName: string): Promise<TEntity[] | null>
    {
        const response = await this.client.query(
            faunaQuery.Map(
                faunaQuery.Paginate(
                    faunaQuery.Documents(
                        faunaQuery.Collection(tableName)
                    )
                ),
                faunaQuery.Lambda(x => faunaQuery.Get(x))
            )
        );

        return response.data
            ? response.data.map((x: { data: TEntity; }) => { return x.data as TEntity; })
            : null;
    }

    private async updateAsync<TEntity>(primaryKey: string, primaryKeyValue: string, data: any): Promise<TEntity | null>
    {
        const response = await this.client.query(
            faunaQuery.Update(
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
            )
        );

        return response.data || null;
    }

    private async deleteAsync(primaryKey: string, primaryKeyValue: string): Promise<boolean>
    {
        try
        {
            await this.client.query(
                faunaQuery.Delete(
                    faunaQuery.Select("ref",
                        faunaQuery.Get(
                            faunaQuery.Match(
                                faunaQuery.Index(primaryKey),
                                primaryKeyValue
                            )
                        )
                    )
                )
            );
            return true;
        }
        catch
        {
            return false;
        }
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

    async userCreate(newUser: DTOs.UserCreate): Promise<DTOs.UserGet | null>
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

    async userAuthenticate({ userName, userPasswordToken }: DTOs.AuthCredentials): Promise<DTOs.UserGet | null>
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

    async projectCreate({ projectName, accessToken, isActive }: DTOs.ProjectCreate): Promise<DTOs.ProjectGet | null>
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

    async projectGetAll(): Promise<DTOs.ProjectGet[] | null>
    {
        const response = await this.getAllAsync<DatabaseSchema.Project.Entity>(DatabaseSchema.Project.tableName);

        if (!response) return null;

        const result = response.map(x => ({
            projectID: x.ProjectID,
            projectName: x.ProjectName,
            isActive: x.IsActive,
            accessToken: x.AccessToken,
        } as DTOs.ProjectGet));

        return result;
    }

    async projectUpdate({ projectID, projectName, accessToken, isActive }: DTOs.ProjectUpdate): Promise<DTOs.ProjectGet | null>
    {

        const projectData: DatabaseSchema.Project.Entity = {
            ProjectID: projectID,
            ProjectName: projectName,
            AccessToken: accessToken,
            IsActive: isActive
        };

        const response = await this.updateAsync<DatabaseSchema.Project.Entity>(
            DatabaseSchema.Project.primarKey.key,
            projectID,
            projectData
        );

        return !response ? null : {
            projectID: response?.ProjectID,
            projectName: response?.ProjectName,
            accessToken: response?.AccessToken,
            isActive: response?.IsActive
        };
    }

    async projectDelete(projectID: string): Promise<boolean>
    {
        return await this.deleteAsync(DatabaseSchema.Project.primarKey.key, projectID);
    }
}