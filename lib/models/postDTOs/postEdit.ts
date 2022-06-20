export interface PostEdit
{
    postID: string
    projectID: string
    userID: string
    imageID: string
    postName: string
    postDescription: string
    postDate: number
    postData: { [key: string]: string }[]
    metaTags: { [key: string]: string }
    isPublished: boolean
}
