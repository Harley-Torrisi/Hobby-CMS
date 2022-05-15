import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';

export default interface DatabaseInterface
{
    /** @async Create all neccesary tables for CMS data access.*/
    createDatabase(): Promise<void>

    /** 
     * @async Create a new User for CMS authentication. 
     * @returns The user's new ID. Depending on implementation, this could be encrypted or not. */
    createUser({ userName, userPasswordToken }: DTOs.NewUser): Promise<DTOs.UserDetails | null>

    /**
     * @async Authenticate user with credential sign in.
     * @returns User object if successful.
     */
    authenticateUser({ userName, userPasswordToken }: DTOs.AuthCredentials): Promise<DTOs.UserDetails | null>

    /** @async Create new Project for Posts to be associated with. */
    createProject({ projectName, accessToken, isActive }: DTOs.NewProject): Promise<DTOs.ProjectDetails | null>
}