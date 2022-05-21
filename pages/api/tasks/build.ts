// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BaseAPI } from '@lib/api/baseAPI'
import { ResponseCodes } from '@lib/api/responseCodes';
import { TasksEndpoint } from '@lib/api/tasksEndpoint';
import { ServiceFactory } from '@lib/serviceFactory';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BaseAPI.RequestResponse<null>>
)
{
  if (req.method !== "POST")
    return res.status(ResponseCodes.BadRequest).json({
      status: ResponseCodes.BadRequest,
      succeeded: false,
      responseMessage: 'POST Only.',
      data: null
    });

  if (process.env.NODE_ENV !== "development")
    return res.status(ResponseCodes.Unauthorized).json({
      status: ResponseCodes.Unauthorized,
      succeeded: false,
      responseMessage: 'Can only be accessed via development mode.',
      data: null
    })

  const reqBody: TasksEndpoint.DTOs.BuildRequestDTO = req.body;

  if (reqBody.accessKey !== process.env.DB_BUILD_SECRET)
    return res.status(ResponseCodes.Unauthorized).json({
      status: ResponseCodes.Unauthorized,
      succeeded: false,
      responseMessage: 'Access Key Invalid.',
      data: null
    });

  try
  {
    const sec = await ServiceFactory.Security.getDefault();
    const userPasswordToken = await sec.hashValue(reqBody.password, process.env.SECURITY_SALT || '');
    const projectAccessToken = await sec.hashValue(reqBody.projectName, process.env.SECURITY_SALT || '');
    const db = await ServiceFactory.DatabaseFactory.getDefault();
    await db.createDatabase();
    const createU = await db.userCreate({ displayName: reqBody.userDisplayName, userName: reqBody.username, userPasswordToken: userPasswordToken });
    if (!createU) throw new Error("Failed to create new user.");
    const createP = await db.projectCreate({ projectName: reqBody.projectName, isActive: true, accessToken: projectAccessToken });
    if (!createP) throw new Error("Failed to create new project.");

    return res.status(ResponseCodes.SuccessPost).json({
      status: ResponseCodes.SuccessPost,
      succeeded: true,
      responseMessage: 'Created',
      data: null
    })
  }
  catch (exception: any)
  {
    return res.status(ResponseCodes.ServerError).json({
      status: ResponseCodes.ServerError,
      succeeded: false,
      responseMessage: exception.message,
      data: null
    })
  }
}
