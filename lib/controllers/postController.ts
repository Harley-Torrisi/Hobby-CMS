import { PostModel } from "@lib/database/models/postModel";
import { PostCreate } from "@lib/models/postDTOs/postCreate";
import { PostListItem } from "@lib/models/postDTOs/postListItem";
import { BaseControllerCS } from "./_baseControllerCS";
import { BaseControllerSS } from "./_baseControllerSS";
import { getUnixTime } from "date-fns";
import { PostEdit } from "@lib/models/postDTOs/postEdit";

export interface PostControllerInterface
{
    getPostListItems(): Promise<PostListItem[]>
    create(data: PostCreate): Promise<PostModel>
    get(postID: string): Promise<PostEdit>
    update(data: PostEdit): Promise<void>
}


export class PostControllerCS extends BaseControllerCS implements PostControllerInterface
{
    async update(data: PostEdit): Promise<void>
    {
        const response = await this.api.Request<void>({
            method: "PUT",
            action: "post",
            data: data
        });

        if (!response.succeeded)
            throw response.responseMessage;
    }

    async get(postID: string): Promise<PostEdit>
    {
        const response = await this.api.Request<PostEdit>({
            method: "GET",
            action: "post",
            queryParams: {
                postID
            }
        });

        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async getPostListItems(): Promise<PostListItem[]>
    {
        const response = await this.api.Request<PostListItem[]>({
            method: "GET",
            action: "post/fragment/list-item",
        });
        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async create(data: PostCreate): Promise<PostModel>
    {
        const response = await this.api.Request<PostModel>({
            method: "POST",
            action: "post",
            data: data
        });
        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }
}

export class PostControllerSS extends BaseControllerSS implements PostControllerInterface
{
    async update(data: PostEdit): Promise<void>
    {
        const db = await this.dbPromise;
        await db.postUpdate(
            data.postID,
            data.projectID,
            data.postName,
            data.postDescription,
            data.postDate,
            data.postData,
            data.userID,
            data.imageID,
            data.metaTags,
            data.isPublished
        );
    }

    async get(postID: string): Promise<PostEdit>
    {
        const db = await this.dbPromise;
        const response = await db.postGet(postID);
        const data: PostEdit = {
            postID: response.PostID,
            projectID: response.ProjectID,
            userID: response.UserID,
            imageID: response.ImageID,
            postName: response.PostName,
            postDescription: response.PostDescription,
            postDate: response.PostDate,
            postData: response.PostData,
            metaTags: response.MetaTags,
            isPublished: response.IsPublished,
        };
        return data;
    }

    async getPostListItems(): Promise<PostListItem[]>
    {
        const db = await this.dbPromise;
        const response = await db.postGetListItems();
        return response;
    }

    async create(data: PostCreate): Promise<PostModel>
    {
        const db = await this.dbPromise;
        const response = await db.postCreate(data.projectId, data.postName, '', getUnixTime(new Date()), [], data.userId, '', {}, false);
        return response;
    }
}