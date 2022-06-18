import { FaunaQueries } from "./faunaQueries";
import { DatabaseContextInterface } from "../context/databaseContextInterface";
import { ImageModel } from "../models/imageModel";
import { PostModel } from "../models/postModel";
import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";

enum DatabaseNames
{
    User = "User",
    Project = "Project",
    Post = "Post",
    Image = "Image",
}

enum DatabasePrimaryKeys
{
    User = "User_PK",
    Project = "Project_PK",
    Post = "Post_PK",
    Image = "Image_PK",
}

// enum DatabaseForiegnKeys
// {
//     UserProject = "User_Project_FK"
// }

enum DatabasePrimaryKeyColumns
{
    User = "UserID",
    Project = "ProjectID",
    Post = "PostID",
    Image = "ImageID",
}

export class FaunaContext implements DatabaseContextInterface
{
    cxt: FaunaQueries;

    constructor(
        secret: string,
        domain: string,
        port: number,
        scheme: "http" | "https" | undefined,
    )
    {
        this.cxt = new FaunaQueries({
            secret: secret,
            domain: domain,
            port: port,
            scheme: scheme,
        });
    }

    async userCreate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean): Promise<UserModel>
    {
        const response = await this.cxt.create<UserModel>(DatabaseNames.User, { UserID, UserName, PasswordToken, IsAdmin } as UserModel)
        return response;
    }

    async userGet(UserID: string): Promise<UserModel | null>
    {
        const response = await this.cxt.get<UserModel | null>(DatabasePrimaryKeys.User, UserID);
        return response;
    }

    async userGetAll(): Promise<UserModel[]>
    {
        const response = await this.cxt.getAll<UserModel>(DatabaseNames.User);
        return response;
    }

    async userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean): Promise<void>
    {
        await this.cxt.update(
            DatabasePrimaryKeys.User, UserID,
            { UserName, PasswordToken, IsAdmin, IsActive } as UserModel
        );
    }

    async userDelete(UserID: string): Promise<void>
    {
        await this.cxt.delete(DatabasePrimaryKeys.User, UserID);
    }

    async projectCreate(ProjectName: string, AccessToken: string): Promise<ProjectModel>
    {
        const response = this.cxt.create(DatabaseNames.Project, {
            ProjectID: await this.cxt.newID(),
            ProjectName,
            AccessToken,
            IsActive: true
        } as ProjectModel)
        return response;
    }

    async projectGet(ProjectID: string): Promise<ProjectModel | null>
    {
        const response = await this.cxt.get<ProjectModel | null>(DatabasePrimaryKeys.Project, ProjectID);
        return response;
    }

    async projectGetAll(): Promise<ProjectModel[]>
    {
        const response = await this.cxt.getAll<ProjectModel>(DatabaseNames.Project);
        return response;
    }

    async projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean): Promise<ProjectModel>
    {
        return await this.cxt.update(
            DatabasePrimaryKeys.Project, ProjectID,
            { ProjectName, AccessToken, IsActive } as ProjectModel
        );
    }

    async projectDelete(ProjectID: string): Promise<void>
    {
        await this.cxt.delete(DatabasePrimaryKeys.Project, ProjectID);
    }

    async postCreate(ProjectID: string, UserID: string, ImageID: string | undefined, PostDescription: string | undefined, PostDate: string, PostData: string, MetaTags: string | undefined, IsPublished: boolean): Promise<PostModel>
    {
        const response = this.cxt.create(
            DatabaseNames.Post,
            { ProjectID, UserID, ImageID: ImageID, PostDescription, PostDate, PostData, MetaTags, IsPublished } as PostModel
        );
        return response;
    }

    async postGet(PostID: string): Promise<PostModel | null>
    {
        const response = await this.cxt.get<PostModel | null>(DatabasePrimaryKeys.Post, PostID);
        return response;
    }

    async postGetAll(): Promise<PostModel[]>
    {
        const response = await this.cxt.getAll<PostModel>(DatabaseNames.Post);
        return response;
    }

    async postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number): Promise<ProjectModel[]>
    {
        throw new Error("Method not implemented.");
    }

    async postUpdate(PostID: string, ProjectID: string, UserID: string, ImageID: string | undefined, PostDescription: string | undefined, PostDate: string, PostData: string, MetaTags: string | undefined, IsPublished: boolean): Promise<void>
    {
        await this.cxt.update(
            DatabasePrimaryKeys.Post, PostID,
            { ProjectID, UserID, ImageID, PostDescription, PostDate, PostData, MetaTags, IsPublished } as PostModel
        );
    }

    async postDelete(PostID: string): Promise<void>
    {
        await this.cxt.delete(DatabasePrimaryKeys.Post, PostID);
    }

    async imageCreate(ImageData: string): Promise<ImageModel>
    {
        const response = await this.cxt.create(DatabaseNames.Image, { ImageData } as ImageModel)
        return response;
    }

    async imageGet(ImageID: string): Promise<ImageModel | null>
    {
        const response = await this.cxt.get<ImageModel | null>(DatabasePrimaryKeys.Image, ImageID);
        return response;
    }

    async imageGetPaged(pageNumber: number, pageSize: number): Promise<ImageModel[]>
    {
        throw new Error("Method not implemented.");
    }

    async imageDelete(ImageID: string): Promise<void>
    {
        await this.cxt.delete(DatabasePrimaryKeys.Image, ImageID);
    }

    async databaseCreate(): Promise<void>
    {
        await Promise.all([
            this.cxt.taskCollectionCreate(DatabaseNames.User),
            this.cxt.taskCollectionCreate(DatabaseNames.Project),
            this.cxt.taskCollectionCreate(DatabaseNames.Post),
            this.cxt.taskCollectionCreate(DatabaseNames.Image)
        ])

        await Promise.all([
            this.cxt.taskIndexCreate(DatabaseNames.User, DatabasePrimaryKeys.User, DatabasePrimaryKeyColumns.User),
            this.cxt.taskIndexCreate(DatabaseNames.Project, DatabasePrimaryKeys.Project, DatabasePrimaryKeyColumns.Project),
            this.cxt.taskIndexCreate(DatabaseNames.Post, DatabasePrimaryKeys.Post, DatabasePrimaryKeyColumns.Post),
            this.cxt.taskIndexCreate(DatabaseNames.Image, DatabasePrimaryKeys.Image, DatabasePrimaryKeyColumns.Image)
        ])
    }
}