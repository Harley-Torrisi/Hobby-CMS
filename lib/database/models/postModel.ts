import { PostBlockData } from "@lib/types/postBlockData"

export interface PostModel
{
    PostID: string
    ProjectID: string
    UserID: string
    ImageID: string
    PostName: string
    PostDescription: string
    PostDate: number
    PostData: PostBlockData[]
    MetaTags: { [key: string]: string }
    IsPublished: boolean
}