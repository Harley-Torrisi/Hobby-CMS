export interface PostModel
{
    PostID: string
    ProjectID: string
    UserID: string
    ImageID?: string
    PostName: string
    PostDescription?: string
    PostDate: string
    PostData: string
    MetaTags?: string
    IsPublished: boolean
}