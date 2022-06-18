import { ProjectCreateRequest } from "@lib/models/projectDTOs/projectCreateRequest";
import { ProjectDeleteRequest } from "@lib/models/projectDTOs/projectDeleteRequest";
import { ProjectGetResponse } from "@lib/models/projectDTOs/projectGetResponse";
import { ProjectUpdateRequest } from "@lib/models/projectDTOs/projectUpdateRequest";
import { CryptoServiceFactory } from "@lib/services/cryptoService";
import { BaseControllerCS } from "./_baseControllerCS";
import { BaseControllerSS } from "./_baseControllerSS";

export interface ProjectControllerInterface
{
    getAllProjects(): Promise<ProjectGetResponse[]>
    deteProject(data: ProjectDeleteRequest): Promise<boolean>
    updateProject(data: ProjectUpdateRequest): Promise<ProjectGetResponse>
    createProject(data: ProjectCreateRequest): Promise<ProjectGetResponse>
}

export class ProjectControllerCS extends BaseControllerCS implements ProjectControllerInterface
{
    async createProject(data: ProjectCreateRequest): Promise<ProjectGetResponse>
    {
        const response = await this.api.Request<ProjectGetResponse>({
            method: "POST",
            action: "project",
            data: data
        });

        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async updateProject(projectUpdate: ProjectUpdateRequest): Promise<ProjectGetResponse>
    {
        const response = await this.api.Request<ProjectGetResponse>({
            method: "PUT",
            action: "project",
            data: projectUpdate
        });

        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async getAllProjects(): Promise<ProjectGetResponse[]>
    {
        const response = await this.api.Request<ProjectGetResponse[]>({
            method: "GET",
            action: "project",
        });
        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async deteProject(data: ProjectDeleteRequest): Promise<boolean>
    {
        const response = await this.api.Request<boolean>({
            method: "DELETE",
            action: "project",
            data: data
        });

        if (!response.succeeded)
            throw response.responseMessage;

        return true;
    }
}

export class ProjectControllerSS extends BaseControllerSS implements ProjectControllerInterface
{
    async createProject(data: ProjectCreateRequest): Promise<ProjectGetResponse>
    {
        const sec = await CryptoServiceFactory.getDefault();
        const accessToken = await sec.hashValueDefault(data.projectName + await sec.randomUUID());

        const db = await this.dbPromise;
        const request = await db.projectCreate(data.projectName, accessToken);

        const response: ProjectGetResponse = {
            projectID: request.ProjectID,
            projectName: request.ProjectName,
            accessToken: request.AccessToken,
            isActive: request.IsActive
        };

        return response;
    }

    async updateProject(data: ProjectUpdateRequest): Promise<ProjectGetResponse>
    {
        const db = await this.dbPromise;

        const request = await db.projectUpdate(
            data.projectID,
            data.projectName,
            data.accessToken,
            data.isActive
        );

        const response: ProjectGetResponse = {
            projectID: request.ProjectID,
            projectName: request.ProjectName,
            accessToken: request.AccessToken,
            isActive: request.IsActive
        };

        return response;
    }

    async getAllProjects(): Promise<ProjectGetResponse[]>
    {
        const db = await this.dbPromise;
        const response = await db.projectGetAll();
        const data = response.map(x => ({
            projectID: x.ProjectID,
            projectName: x.ProjectName,
            accessToken: x.AccessToken,
            isActive: x.IsActive
        } as ProjectGetResponse))

        return data;
    }

    async deteProject(data: ProjectDeleteRequest): Promise<boolean>
    {
        const db = await this.dbPromise;
        await db.projectDelete(data.projectID);
        return true;
    }
}