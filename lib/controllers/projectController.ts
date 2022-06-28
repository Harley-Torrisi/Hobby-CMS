import { ProjectModel, projectModelFromEntity, projectModelToEntity } from "@lib/models/project/projectModel";
import { ProjectOptionItem } from "@lib/models/project/projectOptionItem";
import { CryptoServiceFactory } from "@lib/services/cryptoService";
import { BaseControllerCS } from "./_baseControllerCS";
import { BaseControllerSS } from "./_baseControllerSS";

export interface ProjectControllerInterface
{
    getAll(): Promise<ProjectModel[]>
    getOptionItems(): Promise<ProjectOptionItem[]>
    delete(projectId: string): Promise<boolean>
    update(data: ProjectModel): Promise<void>
    create(projectName: string): Promise<ProjectModel>
}

export class ProjectControllerCS extends BaseControllerCS implements ProjectControllerInterface
{
    async getOptionItems(): Promise<ProjectOptionItem[]>
    {
        const response = await this.api.Request<ProjectOptionItem[]>({
            method: "GET",
            action: "project/fragment/options",
        });
        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async create(projectName: string): Promise<ProjectModel>
    {
        const response = await this.api.Request<ProjectModel>({
            method: "POST",
            action: "project",
            data: { projectName }
        });

        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async update(data: ProjectModel): Promise<void>
    {
        const response = await this.api.Request<ProjectModel>({
            method: "PUT",
            action: "project",
            data: data
        });

        if (!response.succeeded)
            throw response.responseMessage;
    }

    async getAll(): Promise<ProjectModel[]>
    {
        const response = await this.api.Request<ProjectModel[]>({
            method: "GET",
            action: "project",
        });
        if (!response.succeeded || !response.data)
            throw response.responseMessage;

        return response.data;
    }

    async delete(projectId: string): Promise<boolean>
    {
        const response = await this.api.Request<boolean>({
            method: "DELETE",
            action: "project",
            data: { projectId }
        });

        if (!response.succeeded)
            throw response.responseMessage;

        return true;
    }
}

export class ProjectControllerSS extends BaseControllerSS implements ProjectControllerInterface
{
    async getOptionItems(): Promise<ProjectOptionItem[]>
    {
        const db = await this.dbPromise;
        const response = await db.projectGetOptionItems();
        return response;
    }

    async create(projectName: string): Promise<ProjectModel>
    {
        const sec = await CryptoServiceFactory.getDefault();
        const accessToken = await sec.hashValueDefault(projectName + await sec.randomUUID());
        const db = await this.dbPromise;
        const response = await db.projectCreate(projectName, accessToken);
        const data: ProjectModel = projectModelFromEntity(response);
        return data;
    }

    async update(data: ProjectModel): Promise<void>
    {
        const db = await this.dbPromise;
        await db.projectUpdate(
            projectModelToEntity(data)
        );
    }

    async getAll(): Promise<ProjectModel[]>
    {
        const db = await this.dbPromise;
        const response = await db.projectGetAll();
        const data = response.map(x => { return projectModelFromEntity(x) })
        return data;
    }

    async delete(projectId: string): Promise<boolean>
    {
        const db = await this.dbPromise;
        await db.projectDelete(projectId);
        return true;
    }
}