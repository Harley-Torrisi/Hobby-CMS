import { AxiosRequestConfig, AxiosRequestHeaders, AxiosStatic, Method } from "axios"

export namespace BaseAPI
{
    export interface RequestResponse<TData>
    {
        status: number
        succeeded: boolean
        responseMessage: string
        data: TData | null
    }

    export interface BaseRequest
    {
        method: Method,
        action: string,
        data?: any,
        queryParams?: any,
        headers?: AxiosRequestHeaders
    }

    export class _base
    {
        private cxt: AxiosStatic

        constructor()
        {
            this.cxt = require('axios');
        }

        protected async BaseRequest<TData>({
            method,
            action,
            data,
            queryParams,
            headers
        }: BaseRequest)
        {
            try
            {
                const options: AxiosRequestConfig = {
                    url: '/api/' + action,
                    method: method,
                    data: data,
                    params: queryParams,
                    headers: headers,
                }
                const req = await this.cxt.request(options);
                const res: RequestResponse<TData> = req.data as unknown as RequestResponse<TData>;
                try
                {
                    res.status = req.status;
                } catch { }
                return res;
            }
            catch (exception: any)
            {
                if (exception.response.data)
                    return exception.response.data as RequestResponse<TData>;

                return exception.response as unknown as RequestResponse<TData>;
            }
        }
    }
}