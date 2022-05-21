import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';

export default interface DatabaseInterface
{
    /** @async Create all neccesary tables for CMS data access.*/
    createDatabase(): Promise<void>

    /** 
     * @async Create a new User for CMS authentication. 
     * @returns The user's new ID. Depending on implementation, this could be encrypted or not. */
    userCreate({ displayName, userName, userPasswordToken }: DTOs.UserCreate): Promise<DTOs.UserGet | null>

    /**
     * @async Authenticate user with credential sign in.
     * @returns User object if successful.
     */
    userAuthenticate({ userName, userPasswordToken }: DTOs.AuthCredentials): Promise<DTOs.UserGet | null>

    /** @async Create new Project for Posts to be associated with. */
    projectCreate({ projectName, accessToken, isActive }: DTOs.ProjectCreate): Promise<DTOs.ProjectGet | null>

    /** @async Get all projects. */
    projectGetAll(): Promise<DTOs.ProjectGet[] | null>

    /** @async Update Projects name or Token. */
    projectUpdate({ projectID, projectName, accessToken, isActive }: DTOs.ProjectUpdate): Promise<DTOs.ProjectGet | null>

    /** @async Delete project. */
    projectDelete(projectID: string): Promise<boolean>
}