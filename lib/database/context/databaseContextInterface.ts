import { PostListItem } from "@lib/models/post/postListItem"
import { ProjectOptionItem } from "@lib/models/project/projectOptionItem"
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

    userGet(userId: string):
        Promise<UserEntity>

    userGetAll():
        Promise<UserEntity[]>

    userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean):
        Promise<void>

    userDelete(UserID: string):
        Promise<void>

    projectCreate(ProjectName: string, AccessToken: string):
        Promise<ProjectEntity>

    projectGet(projectID: string):
        Promise<ProjectEntity | null>

    projectGetAll():
        Promise<ProjectEntity[]>

    projectGetOptionItems():
        Promise<ProjectOptionItem[]>

    projectUpdate(data: ProjectEntity):
        Promise<void>

    projectDelete(ProjectID: string):
        Promise<void>

    postCreate(
        postName: string,
        projectId: string,
        userId: string,
    ):
        Promise<PostEntity>

    postGet(postID: string):
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