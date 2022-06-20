import { FaunaQueries } from "./faunaQueries";
import { DatabaseContextInterface } from "../context/databaseContextInterface";
import { ImageModel } from "../models/imageModel";
import { PostModel } from "../models/postModel";
import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";
import { ProjectOptionItem } from "@lib/models/projectDTOs/projectOptionItem";
import { Get, Lambda, Select, Var } from "faunadb";
import { PostListItem } from "@lib/models/postDTOs/postListItem";

enum TableNames
{
    User = "User",
    Project = "Project",
    Post = "Post",
    Image = "Image",
}

enum TableIndexNames
{
    User = "User_PK",
    Project = "Project_PK",
    Post = "Post_PK",
    Image = "Image_PK",
}

enum TableIndexColumns
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
        const response = await this.cxt.create<UserModel>(TableNames.User, { UserID, UserName, PasswordToken, IsAdmin } as UserModel)
        return response;
    }

    async userGet(UserID: string): Promise<UserModel | null>
    {
        const response = await this.cxt.get<UserModel | null>(TableIndexNames.User, UserID);
        return response;
    }

    async userGetAll(): Promise<UserModel[]>
    {
        const response = await this.cxt.getAll<UserModel>(TableNames.User);
        return response;
    }

    async userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean): Promise<void>
    {
        await this.cxt.update(
            TableIndexNames.User, UserID,
            { UserName, PasswordToken, IsAdmin, IsActive } as UserModel
        );
    }

    async userDelete(UserID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.User, UserID);
    }

    async projectCreate(ProjectName: string, AccessToken: string): Promise<ProjectModel>
    {
        const response = this.cxt.create(TableNames.Project, {
            ProjectID: await this.cxt.newID(),
            ProjectName,
            AccessToken,
            IsActive: true
        } as ProjectModel)
        return response;
    }

    async projectGet(ProjectID: string): Promise<ProjectModel | null>
    {
        const response = await this.cxt.get<ProjectModel | null>(TableIndexNames.Project, ProjectID);
        return response;
    }

    async projectGetAll(): Promise<ProjectModel[]>
    {
        const response = await this.cxt.getAll<ProjectModel>(TableNames.Project);
        return response;
    }

    async projectGetOptionItems(): Promise<ProjectOptionItem[]>
    {
        const response = await this.cxt.getAllFragmented<ProjectOptionItem>(
            TableNames.Project,
            Lambda(
                "x",
                {
                    projectId: Select(['data', 'ProjectID'], Get(Var("x"))),
                    projectName: Select(['data', 'ProjectName'], Get(Var("x")))
                } as unknown as ProjectOptionItem
            )
        );
        return response;
    }

    async projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean): Promise<ProjectModel>
    {
        return await this.cxt.update(
            TableIndexNames.Project, ProjectID,
            { ProjectName, AccessToken, IsActive } as ProjectModel
        );
    }

    async projectDelete(ProjectID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.Project, ProjectID);
    }

    async postCreate(
        ProjectID: string,
        PostName: string,
        PostDescription: string,
        PostDate: number,
        PostData: { [key: string]: string }[],
        UserID: string,
        ImageID: string,
        MetaTags: { [key: string]: string },
        IsPublished: boolean
    ): Promise<PostModel>
    {
        const response = this.cxt.create(
            TableNames.Post,
            { PostID: await this.cxt.newID(), ProjectID, PostName, PostDescription, PostDate, PostData, UserID, ImageID, MetaTags, IsPublished } as PostModel
        );
        return response;
    }

    async postGet(PostID: string): Promise<PostModel>
    {
        const response = await this.cxt.get<PostModel>(TableIndexNames.Post, PostID);
        return response;
    }

    async postGetAll(): Promise<PostModel[]>
    {
        const response = await this.cxt.getAll<PostModel>(TableNames.Post);
        return response;
    }

    async postGetListItems(): Promise<PostListItem[]>
    {
        const response = await this.cxt.getAllFragmented<PostListItem>(
            TableNames.Post,
            Lambda(
                "x",
                {
                    postId: Select(['data', 'PostID'], Get(Var("x"))),
                    projectId: Select(['data', 'ProjectID'], Get(Var("x"))),
                    postName: Select(['data', 'PostName'], Get(Var("x"))),
                    postDate: Select(['data', 'PostDate'], Get(Var("x"))),
                    isPublished: Select(['data', 'IsPublished'], Get(Var("x")))
                } as unknown as PostListItem
            )
        );
        return response;
    }

    async postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number): Promise<ProjectModel[]>
    {
        throw new Error("Method not implemented.");
    }

    async postUpdate(
        PostID: string,
        ProjectID: string,
        PostName: string,
        PostDescription: string,
        PostDate: number,
        PostData: { [key: string]: string }[],
        UserID: string,
        ImageID: string,
        MetaTags: { [key: string]: string },
        IsPublished: boolean
    ): Promise<void>
    {
        await this.cxt.update(
            TableIndexNames.Post, PostID,
            { ProjectID, PostName, UserID, ImageID, PostDescription, PostDate, PostData, MetaTags, IsPublished } as PostModel
        );
    }

    async postDelete(PostID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.Post, PostID);
    }

    async imageCreate(ImageData: string): Promise<ImageModel>
    {
        const response = await this.cxt.create(TableNames.Image, { ImageData } as ImageModel)
        return response;
    }

    async imageGet(ImageID: string): Promise<ImageModel | null>
    {
        const response = await this.cxt.get<ImageModel | null>(TableIndexNames.Image, ImageID);
        return response;
    }

    async imageGetPaged(pageNumber: number, pageSize: number): Promise<ImageModel[]>
    {
        throw new Error("Method not implemented.");
    }

    async imageDelete(ImageID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.Image, ImageID);
    }

    async databaseCreate(): Promise<void>
    {
        await Promise.all([
            this.cxt.taskCollectionCreate(TableNames.User),
            this.cxt.taskCollectionCreate(TableNames.Project),
            this.cxt.taskCollectionCreate(TableNames.Post),
            this.cxt.taskCollectionCreate(TableNames.Image)
        ])

        await Promise.all([
            this.cxt.taskIndexCreate(TableNames.User, TableIndexNames.User, TableIndexColumns.User),
            this.cxt.taskIndexCreate(TableNames.Project, TableIndexNames.Project, TableIndexColumns.Project),
            this.cxt.taskIndexCreate(TableNames.Post, TableIndexNames.Post, TableIndexColumns.Post),
            this.cxt.taskIndexCreate(TableNames.Image, TableIndexNames.Image, TableIndexColumns.Image)
        ])
    }
}
