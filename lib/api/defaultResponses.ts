import { BaseAPI } from '@lib/api/baseAPI';
import { ResponseCodes } from '@lib/api/responseCodes';
import { Redirect } from 'next';

export namespace DefaultResponses
{
    export const notFound: BaseAPI.RequestResponse<null> =
    {
        status: ResponseCodes.NotFound,
        succeeded: false,
        responseMessage: 'Not Found',
        data: null
    };

    export const serverError: BaseAPI.RequestResponse<null> =
    {
        status: ResponseCodes.ServerError,
        succeeded: false,
        responseMessage: 'Server Error',
        data: null
    };

    export const unathorized: BaseAPI.RequestResponse<null> =
    {
        status: ResponseCodes.Unauthorized,
        succeeded: false,
        responseMessage: 'Unauthorized',
        data: null
    };

    export const successDelete: BaseAPI.RequestResponse<null> =
    {
        status: ResponseCodes.SuccessDelete,
        succeeded: true,
        data: null
    };

    export const redirect = (path?: string) =>
    {
        return {
            redirect: {
                destination: path,
                permanent: false,
            } as Redirect
        }
    }
}