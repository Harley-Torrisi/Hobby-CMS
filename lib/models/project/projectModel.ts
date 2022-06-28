import { ProjectEntity } from "@lib/database/models/projectEntity";

export interface ProjectModel
{
    projectID: string
    projectName: string
    accessToken: string
    isActive: boolean
}

export function projectModelFromEntity(data: ProjectEntity): ProjectModel
{
    return {
        projectID: data.ProjectID,
        projectName: data.ProjectName,
        accessToken: data.AccessToken,
        isActive: data.IsActive
    };
}

export function projectModelToEntity(data: ProjectModel): ProjectEntity
{
    return {
        ProjectID: data.projectID,
        ProjectName: data.projectName,
        AccessToken: data.accessToken,
        IsActive: data.isActive
    };
}