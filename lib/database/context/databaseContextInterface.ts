import { PostListItem } from "@lib/models/postDTOs/postListItem"
import { ProjectOptionItem } from "@lib/models/projectDTOs/projectOptionItem"
import { ImageModel } from "../models/imageModel"
import { PostModel } from "../models/postModel"
import { ProjectModel } from "../models/projectModel"
import { UserModel } from "../models/userModel"

export interface DatabaseContextInterface
{
    databaseCreate():
        Promise<void>

    userCreate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean):
        Promise<UserModel>

    userGet(UserID: string):
        Promise<UserModel | null>

    userGetAll():
        Promise<UserModel[]>

    userUpdate(UserID: string, UserName: string, PasswordToken: string, IsAdmin: boolean, IsActive: boolean):
        Promise<void>

    userDelete(UserID: string):
        Promise<void>

    projectCreate(ProjectName: string, AccessToken: string):
        Promise<ProjectModel>

    projectGet(ProjectID: string):
        Promise<ProjectModel | null>

    projectGetAll():
        Promise<ProjectModel[]>

    projectGetOptionItems():
        Promise<ProjectOptionItem[]>

    projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean):
        Promise<ProjectModel>

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
        Promise<PostModel>

    postGet(PostID: string):
        Promise<PostModel>

    postGetAll():
        Promise<PostModel[]>

    postGetListItems():
        Promise<PostListItem[]>

    postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number):
        Promise<ProjectModel[]>

    postUpdate(
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
    ):
        Promise<void>

    postDelete(PostID: string):
        Promise<void>

    imageCreate(ImageData: string):
        Promise<ImageModel>

    imageGet(ImageID: string):
        Promise<ImageModel | null>

    imageGetPaged(pageNumber: number, pageSize: number):
        Promise<ImageModel[]>

    imageDelete(ImageID: string):
        Promise<void>
}