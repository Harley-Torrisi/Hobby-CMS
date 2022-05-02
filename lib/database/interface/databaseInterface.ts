import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';

export default interface DatabaseInterface
{
    /** @async Create all neccesary tables for CMS data access.*/
    createDatabase(): Promise<void>

    /** 
     * @async Create a new User for CMS authentication. 
     * @returns The user's new ID. Depending on implementation, this could be encrypted or not. */
    createUser({ userName, userPassword, isAdmin }: DTOs.NewUser): Promise<string>
}