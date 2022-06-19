import { PostModel } from "@lib/database/models/postModel";
import { PostCreate } from "@lib/models/postDTOs/postCreate";
import { PostListItem } from "@lib/models/postDTOs/postListItem";
import { BaseControllerCS } from "./_baseControllerCS";
import { BaseControllerSS } from "./_baseControllerSS";
import { getUnixTime } from "date-fns";

export interface PostControllerInterface
{
    getPostListItems(): Promise<PostListItem[]>
    create(data: PostCreate): Promise<PostModel>
}


export class PostControllerCS extends BaseControllerCS implements PostControllerInterface
{
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
    async getPostListItems(): Promise<PostListItem[]>
    {
        const db = await this.dbPromise;
        const response = await db.postGetListItems();
        return response;
    }

    async create(data: PostCreate): Promise<PostModel>
    {
        const db = await this.dbPromise;
        const response = await db.postCreate(data.projectId, data.postName, '', getUnixTime(new Date()), '', data.userId, '', {}, false);
        return response;
    }
}