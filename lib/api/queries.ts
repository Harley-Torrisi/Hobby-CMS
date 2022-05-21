import { BaseAPI } from "./baseAPI";
import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs'
import { ServiceFactory } from "@lib/serviceFactory";
import { ResponseCodes } from "./responseCodes";
import { DefaultResponses } from "./defaultResponses";

export class Queries extends BaseAPI._base
{
    private isServer(): boolean
    {
        return typeof window === 'undefined'
    }

    async getProjects(): Promise<BaseAPI.RequestResponse<DTOs.ProjectGet[] | null>>
    {
        if (this.isServer())
        {
            var db = await ServiceFactory.DatabaseFactory.getDefault();
            const data = await db.projectGetAll();

            return !data ? DefaultResponses.serverError : {
                status: ResponseCodes.SuccessGet,
                succeeded: true,
                data: data
            } as BaseAPI.RequestResponse<DTOs.ProjectGet[]>;
        }
        else
        {
            return await this.BaseRequest<DTOs.ProjectGet[]>({
                method: "GET",
                action: "project"
            });
        }
    }

    async updateProject(project: DTOs.ProjectUpdate): Promise<BaseAPI.RequestResponse<DTOs.ProjectGet | null>>
    {
        if (this.isServer())
        {
            var db = await ServiceFactory.DatabaseFactory.getDefault();
            const data = await db.projectUpdate({ projectID: project.projectID, projectName: project.projectName, accessToken: project.accessToken, isActive: project.isActive });

            return !data ? DefaultResponses.serverError : {
                status: ResponseCodes.SuccessGet,
                succeeded: true,
                data: data
            } as BaseAPI.RequestResponse<DTOs.ProjectGet>;
        }
        else
        {
            return await this.BaseRequest<DTOs.ProjectGet>({
                method: "PUT",
                action: "project",
                data: project
            });
        }
    }

    async createProject(projectName: string): Promise<BaseAPI.RequestResponse<DTOs.ProjectGet | null>>
    {
        if (this.isServer())
        {
            var db = await ServiceFactory.DatabaseFactory.getDefault();
            var sec = await ServiceFactory.Security.getDefault();
            var accessToken = await sec.hashValue(projectName, process.env.SECURITY_SALT ?? 'iAmBatmanBbyY0l0');

            var data = await db.projectCreate({ projectName, accessToken, isActive: true });

            return !data ? DefaultResponses.serverError : {
                status: ResponseCodes.SuccessGet,
                succeeded: true,
                data: data
            } as BaseAPI.RequestResponse<DTOs.ProjectGet>
        }
        else
        {
            return await this.BaseRequest<DTOs.ProjectGet>({
                method: "POST",
                action: "project",
                data: {
                    projectName
                }
            });
        }
    }

    async deleteProject(projectID: string): Promise<BaseAPI.RequestResponse<null>>
    {
        if (this.isServer())
        {
            var db = await ServiceFactory.DatabaseFactory.getDefault();
            var data = await db.projectDelete(projectID);

            return !data ? DefaultResponses.serverError : {
                status: ResponseCodes.SuccessGet,
                succeeded: true,
            } as BaseAPI.RequestResponse<null>;
        }
        else
        {
            return await this.BaseRequest<null>({
                method: "DELETE",
                action: "project",
                data: {
                    projectID
                }
            });
        }
    }
}