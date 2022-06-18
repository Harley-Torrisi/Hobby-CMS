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

    projectUpdate(ProjectID: string, ProjectName: string, AccessToken: string, IsActive: boolean):
        Promise<ProjectModel>

    projectDelete(ProjectID: string):
        Promise<void>

    postCreate(ProjectID: string, UserID: string, ImageID: string | undefined, PostDescription: string | undefined, PostDate: string, PostData: string, MetaTags: string | undefined, IsPublished: boolean):
        Promise<PostModel>

    postGet(PostID: string):
        Promise<PostModel | null>

    postGetAll():
        Promise<PostModel[]>

    postGetByProjectPaged(projectID: number, pageNumber: number, pageSize: number):
        Promise<ProjectModel[]>

    postUpdate(PostID: string, ProjectID: string, UserID: string, ImageID: string | undefined, PostDescription: string | undefined, PostDate: string, PostData: string, MetaTags: string | undefined, IsPublished: boolean):
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