import { DictionaryS } from "@lib/types/dictionary"
import { PostBlockData } from "@lib/types/postBlockData"

export interface PostEntity
{
    PostID: string
    ProjectID: string
    UserID: string
    ImageID: string
    PostName: string
    PostDescription: string
    PostDate: number
    PostBlocks: PostBlockData[]
    MetaData: DictionaryS<string>
    IsPublished: boolean
    Tags: string[]
}