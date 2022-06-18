import { AxiosRequestConfig, AxiosRequestHeaders, Method, Axios } from "axios"
import { Redirect } from "next";

export enum HttpStatusCodes
{
    SuccessGet = 200,
    SuccessPost = 201,
    SuccessDelete = 200,
    BadRequest = 400,
    Unauthorized = 401,
    ServerError = 500,
    NotFound = 404,
}

interface ApiRequest
{
    method: Method,
    action: string,
    data?: any,
    queryParams?: any,
    headers?: AxiosRequestHeaders
}

export interface ApiResponse<TData>
{
    status: number
    succeeded: boolean
    responseMessage: string
    data: TData | null
}

export class ApiResonseBuilder
{
    static notFound(responseMessage: string = 'Not Found'): ApiResponse<null>
    {
        return {
            status: HttpStatusCodes.NotFound,
            succeeded: false,
            responseMessage: responseMessage,
            data: null
        };
    }

    static serverError(responseMessage: string = 'Server Error'): ApiResponse<null>
    {
        return {
            status: HttpStatusCodes.ServerError,
            succeeded: false,
            responseMessage: responseMessage,
            data: null
        }
    }

    static unauthorized(responseMessage: string = 'Unauthroized'): ApiResponse<null>
    {
        return {
            status: HttpStatusCodes.Unauthorized,
            succeeded: false,
            responseMessage: responseMessage,
            data: null
        }
    }

    static successGet<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
    {
        return {
            status: HttpStatusCodes.SuccessGet,
            succeeded: true,
            responseMessage: responseMessage,
            data: data
        }
    }

    static successPost<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
    {
        return {
            status: HttpStatusCodes.SuccessPost,
            succeeded: true,
            responseMessage: responseMessage,
            data: data
        }
    }

    static successDelete<TData>(data: TData, responseMessage: string = 'Success'): ApiResponse<TData>
    {
        return {
            status: HttpStatusCodes.SuccessDelete,
            succeeded: true,
            responseMessage: responseMessage,
            data: data
        }
    }

    static nextRedirect(path?: string)
    {
        return {
            redirect: {
                destination: path,
                permanent: false,
            } as Redirect
        }
    }
}

export class ApiRequester
{
    private cxt: Axios

    constructor()
    {
        this.cxt = new Axios({ baseURL: "/api/secure" });
    }

    public async Request<TData>({
        method,
        action,
        data,
        queryParams,
        headers
    }: ApiRequest): Promise<ApiResponse<TData | null>>
    {
        try
        {
            const options: AxiosRequestConfig = {
                url: action,
                method: method,
                data: JSON.stringify(data),
                params: queryParams,
                headers: { ...{ "content-type": "application/json" }, ...headers }
            }

            const req = await this.cxt.request(options);

            const res: ApiResponse<TData> = typeof req.data === "string"
                ? JSON.parse(req.data)
                : req.data as ApiResponse<TData>;

            try
            {
                res.status = req.status;
            } catch { }

            return res;
        }
        catch (exception: any)
        {
            if (!exception.response)
                return ApiResonseBuilder.serverError();

            if (!exception.response.data)
                return exception.response as unknown as ApiResponse<null>;

            return exception.response.data as ApiResponse<null>;
        }
    }
}

