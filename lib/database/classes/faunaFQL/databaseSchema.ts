export namespace DatabaseSchema
{
    interface KeyValuePair
    {
        key: string
        value: string
    }

    export namespace UserAccount
    {
        export interface Entity
        {
            DisplayName: string
            UserName: string
            UserPasswordToken: string
        }

        export const tableName = 'UserAccount';
        export const primarKey: KeyValuePair = {
            key: 'UserAccount_PK',
            value: 'UserName'
        };
    }

    export namespace Project
    {
        export interface Entity
        {
            ProjectID: string
            ProjectName: string
            AccessToken: string
            IsActive: boolean
        }

        export const tableName = 'Project';
        export const primarKey: KeyValuePair = {
            key: 'Project_PK',
            value: 'ProjectID'
        };
    }

    export namespace Post
    {
        export interface Entity
        {
            PostID: string
            PorjectID: string
            ImageID?: string
            PostUser: string
            PostName: string
            PostDescription: string
            PostDate: Date
            PostData: string
            MetaTag?: string
            IsPublished: boolean
        }

        export const tableName = 'Post';
        export const primarKey: KeyValuePair = {
            key: 'Post_PK',
            value: 'PostID'
        };
    }

    export namespace Image
    {
        export interface Entity
        {
            ImageID: string
            ImageName: string
            DataBase64URL: string
        }

        export const tableName = 'Image';
        export const primarKey: KeyValuePair = {
            key: 'Image_PK',
            value: 'ImageID'
        };
    }
}