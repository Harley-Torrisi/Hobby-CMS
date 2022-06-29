import { PostEntity } from "@lib/database/models/postEntity"
import { DictionaryS } from "@lib/types/dictionary"
import { PostBlockData } from "@lib/types/postBlockData"

export interface PostModel
{
    postID: string
    projectID: string
    userID: string
    imageID: string
    postName: string
    postDescription: string
    postDate: number
    postBlocks: PostBlockData[]
    metaData: DictionaryS<string>
    isPublished: boolean
    tags: string[]
}

export function postModelFromEntity(data: PostEntity): PostModel
{
    return {
        postID: data.PostID,
        projectID: data.ProjectID,
        userID: data.UserID,
        imageID: data.ImageID,
        postName: data.PostName,
        postDescription: data.PostDescription,
        postDate: data.PostDate,
        postBlocks: data.PostBlocks,
        metaData: data.MetaData,
        isPublished: data.IsPublished,
        tags: data.Tags
    };
}

export function postModelToEntity(data: PostModel): PostEntity
{
    return {
        PostID: data.postID,
        ProjectID: data.projectID,
        UserID: data.userID,
        ImageID: data.imageID,
        PostName: data.postName,
        PostDescription: data.postDescription,
        PostDate: data.postDate,
        PostBlocks: data.postBlocks,
        MetaData: data.metaData,
        IsPublished: data.isPublished,
        Tags: data.tags
    };
}