import { BaseAPI } from "./baseAPI";

export namespace TasksEndpoint
{
    export namespace DTOs
    {
        export interface BuildRequestDTO
        {
            username: string
            password: string
            accessKey: string
        }
    }

    export class Handler extends BaseAPI._base
    {
        async buildDatabase(req: DTOs.BuildRequestDTO): Promise<BaseAPI.RequestResponse<any>>
        {
            return await this.BaseRequest<any>({ method: "POST", action: "tasks/build", data: req });
        }
    }
}