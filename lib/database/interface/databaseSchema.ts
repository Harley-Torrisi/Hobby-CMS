export namespace DatabaseSchema
{
    export namespace UserAccount
    {
        export interface Entity
        {
            UserName: string
            UserPasswordToken: string
            IsAdmin: boolean
        }

        export enum Fields { UserName = "UserName", UserPasswordToken = "UserPasswordToken", IsAdmin = "IsAdmin" }

        export const TableName = 'UserAccount';
        export const PrimaryKeyName = 'UserAccount_PK';
    }
}

