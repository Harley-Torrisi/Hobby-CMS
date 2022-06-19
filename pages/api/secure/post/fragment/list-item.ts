import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { ApiResonseBuilder } from '@lib/helpers/internalApiHelper';
import { PostControllerSS } from '@lib/controllers/postController';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
)
{
    const session = await getSession({ req });
    if (!session || !session.user)
    {
        const response = ApiResonseBuilder.unauthorized();
        return res.status(response.status).json(response);
    }

    try
    {
        if (req.method == "GET")
        {
            const controller = new PostControllerSS();
            const projects = await controller.getPostListItems();
            const response = ApiResonseBuilder.successGet(projects);
            return res.status(response.status).json(response);
        }
    }
    catch (error: any)
    {
        const response = ApiResonseBuilder.serverError(error.message);
        return res.status(response.status).json(response);
    }

    const response = ApiResonseBuilder.unauthorized();
    return res.status(response.status).json(response);
}
