import { PostEntity } from "@lib/database/models/postEntity";
import { PostCreate } from "@lib/models/post/postCreate";
import { PostListItem } from "@lib/models/post/postListItem";
import { BaseControllerCS } from "./_baseControllerCS";
import { BaseControllerSS } from "./_baseControllerSS";
import { getUnixTime } from "date-fns";
import { PostModel, postModelFromEntity, postModelToEntity } from "@lib/models/post/postModel";

export interface PostControllerInterface
{
    getPostListItems(): Promise<PostListItem[]>
    create(data: PostCreate): Promise<PostEntity>
    get(postID: string): Promise<PostModel>
    update(data: PostModel): Promise<void>
}


export class PostControllerCS extends BaseControllerCS implements PostControllerInterface
{
    async update(data: PostModel): Promise<void>
    {
        const response = await this.api.Request<void>({
            method: "PUT",
            action: "post",
            data: data
        });

        if (!response.succeeded)
            throw response.responseMessage;
    }

    async get(postID: string): Promise<PostModel>
    {
        const response = await this.api.Request<PostModel>({
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

    async create(data: PostCreate): Promise<PostEntity>
    {
        const response = await this.api.Request<PostEntity>({
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
    async update(data: PostModel): Promise<void>
    {
        const db = await this.dbPromise;
        const payload = postModelToEntity(data);
        await db.postUpdate(payload);
    }

    async get(postID: string): Promise<PostModel>
    {
        const db = await this.dbPromise;
        const response = await db.postGet(postID);
        const data = postModelFromEntity(response);
        return data;
    }

    async getPostListItems(): Promise<PostListItem[]>
    {
        const db = await this.dbPromise;
        const response = await db.postGetListItems();
        return response;
    }

    async create(data: PostCreate): Promise<PostEntity>
    {
        const db = await this.dbPromise;
        const response = await db.postCreate(data.projectId, data.postName, '', getUnixTime(new Date()), [], data.userId, '', {}, false);
        return response;
    }
}