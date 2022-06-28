import { PostListItem } from "@lib/models/post/postListItem"
import { ProjectOptionItem } from "@lib/models/projectDTOs/projectOptionItem"
import { ImageEntity } from "../models/imageEntity"
import { PostEntity } from "../models/postEntity"
import { ProjectEntity } from "../models/projectEntity"
import { UserEntity } from "../models/userEntity"

export interface DatabaseContextInterface
{
    databaseCreate():
        Promise<void>

    userCreate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean):
        Promise<UserEntity>

    userGet(UserID: string):
        Promise<UserEntity | null>

    userGetAll():
        Promise<UserEntity[]>

    userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean):
        Promise<void>

    userDelete(UserID: string):
        Promise<void>

    projectCreate(ProjectName: string, AccessToken: string):
        Promise<ProjectEntity>

    projectGet(ProjectID: string):
        Promise<ProjectEntity | null>

    projectGetAll():
        Promise<ProjectEntity[]>

    projectGetOptionItems():
        Promise<ProjectOptionItem[]>

    projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean):
        Promise<ProjectEntity>

    projectDelete(ProjectID: string):
        Promise<void>

    postCreate(
        ProjectID: string,
        PostName: string,
        PostDescription: string,
        PostDate: number,
        PostData: { [key: string]: string }[],
        UserID: string,
        ImageID: string,
        MetaTags: { [key: string]: string },
        IsPublished: boolean
    ):
        Promise<PostEntity>

    postGet(PostID: string):
        Promise<PostEntity>

    postGetAll():
        Promise<PostEntity[]>

    postGetListItems():
        Promise<PostListItem[]>

    postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number):
        Promise<ProjectEntity[]>

    postUpdate(data: PostEntity):
        Promise<void>

    postDelete(PostID: string):
        Promise<void>

    imageCreate(ImageData: string):
        Promise<ImageEntity>

    imageGet(ImageID: string):
        Promise<ImageEntity | null>

    imageGetPaged(pageNumber: number, pageSize: number):
        Promise<ImageEntity[]>

    imageDelete(ImageID: string):
        Promise<void>
}