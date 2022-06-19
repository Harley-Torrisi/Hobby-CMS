export interface PostModel
{
    PostID: string
    ProjectID: string
    UserID: string
    ImageID: string
    PostName: string
    PostDescription: string
    PostDate: number
    PostData: string
    MetaTags: { [key: string]: string }
    IsPublished: boolean
}