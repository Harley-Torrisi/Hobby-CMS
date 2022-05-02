export namespace DatabaseDTOs
{
    export interface NewUser
    {
        userName: string
        userPasswordToken: string
        isAdmin: boolean
    }

    export interface AuthCredentials
    {
        userName: string
        userPasswordToken: string
    }

    export interface UserDetails
    {
        userName: string
        isAdmin: boolean
    }
}