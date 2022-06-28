import { FaunaQueries } from "./faunaQueries";
import { DatabaseContextInterface } from "../context/databaseContextInterface";
import { ImageEntity } from "../models/imageEntity";
import { PostEntity } from "../models/postEntity";
import { ProjectEntity } from "../models/projectEntity";
import { UserEntity } from "../models/userEntity";
import { ProjectOptionItem } from "@lib/models/projectDTOs/projectOptionItem";
import { Get, Lambda, Select, Var } from "faunadb";
import { PostListItem } from "@lib/models/post/postListItem";

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

    async userCreate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean): Promise<UserEntity>
    {
        const response = await this.cxt.create<UserEntity>(TableNames.User, { UserID, UserName, PasswordToken, IsAdmin } as UserEntity)
        return response;
    }

    async userGet(UserID: string): Promise<UserEntity | null>
    {
        const response = await this.cxt.get<UserEntity | null>(TableIndexNames.User, UserID);
        return response;
    }

    async userGetAll(): Promise<UserEntity[]>
    {
        const response = await this.cxt.getAll<UserEntity>(TableNames.User);
        return response;
    }

    async userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean): Promise<void>
    {
        await this.cxt.update(
            TableIndexNames.User, UserID,
            { UserName, PasswordToken, IsAdmin, IsActive } as UserEntity
        );
    }

    async userDelete(UserID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.User, UserID);
    }

    async projectCreate(ProjectName: string, AccessToken: string): Promise<ProjectEntity>
    {
        const response = this.cxt.create(TableNames.Project, {
            ProjectID: await this.cxt.newID(),
            ProjectName,
            AccessToken,
            IsActive: true
        } as ProjectEntity)
        return response;
    }

    async projectGet(ProjectID: string): Promise<ProjectEntity | null>
    {
        const response = await this.cxt.get<ProjectEntity | null>(TableIndexNames.Project, ProjectID);
        return response;
    }

    async projectGetAll(): Promise<ProjectEntity[]>
    {
        const response = await this.cxt.getAll<ProjectEntity>(TableNames.Project);
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

    async projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean): Promise<ProjectEntity>
    {
        return await this.cxt.update(
            TableIndexNames.Project, ProjectID,
            { ProjectName, AccessToken, IsActive } as ProjectEntity
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
    ): Promise<PostEntity>
    {
        const response = this.cxt.create(
            TableNames.Post,
            { PostID: await this.cxt.newID(), ProjectID, PostName, PostDescription, PostDate, PostBlocks: PostData, UserID, ImageID, MetaTags, IsPublished } as PostEntity
        );
        return response;
    }

    async postGet(PostID: string): Promise<PostEntity>
    {
        const response = await this.cxt.get<PostEntity>(TableIndexNames.Post, PostID);
        return response;
    }

    async postGetAll(): Promise<PostEntity[]>
    {
        const response = await this.cxt.getAll<PostEntity>(TableNames.Post);
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

    async postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number): Promise<ProjectEntity[]>
    {
        throw new Error("Method not implemented.");
    }

    async postUpdate(data: PostEntity): Promise<void>
    {
        await this.cxt.replace(
            TableIndexNames.Post, data.PostID,
            data
        );
    }

    async postDelete(PostID: string): Promise<void>
    {
        await this.cxt.delete(TableIndexNames.Post, PostID);
    }

    async imageCreate(ImageData: string): Promise<ImageEntity>
    {
        const response = await this.cxt.create(TableNames.Image, { ImageData } as ImageEntity)
        return response;
    }

    async imageGet(ImageID: string): Promise<ImageEntity | null>
    {
        const response = await this.cxt.get<ImageEntity | null>(TableIndexNames.Image, ImageID);
        return response;
    }

    async imageGetPaged(pageNumber: number, pageSize: number): Promise<ImageEntity[]>
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
