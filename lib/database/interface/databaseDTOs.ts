export namespace DatabaseDTOs
{
    export interface AuthCredentials
    {
        userName: string
        userPasswordToken: string
    }

    export interface UserCreate
    {
        displayName: string
        userName: string
        userPasswordToken: string
    }

    export interface UserGet
    {
        displayName: string
        userName: string
    }

    export interface ProjectCreate
    {
        projectName: string
        accessToken: string
        isActive: boolean
    }

    export interface ProjectGet
    {
        projectID: string
        projectName: string
        accessToken: string
        isActive: boolean
    }

    export interface ProjectUpdate
    {
        projectID: string
        projectName: string
        accessToken: string
        isActive: boolean
    }
}