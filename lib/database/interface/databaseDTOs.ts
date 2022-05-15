export namespace DatabaseDTOs
{
    export interface NewUser
    {
        displayName: string
        userName: string
        userPasswordToken: string
    }

    export interface NewProject
    {
        projectName: string
        accessToken: string
        isActive: boolean
    }

    export interface AuthCredentials
    {
        userName: string
        userPasswordToken: string
    }

    export interface UserDetails
    {
        displayName: string
        userName: string
    }

    export interface ProjectDetails
    {
        projectID: string
        projectName: string
        accessToken: string
        isActive: boolean
    }
}