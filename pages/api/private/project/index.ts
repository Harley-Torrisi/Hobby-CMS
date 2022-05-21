// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { BaseAPI } from '@lib/api/baseAPI';
import { getSession } from 'next-auth/react';
import { ServiceFactory } from '@lib/serviceFactory';
import { DefaultResponses } from '@lib/api/defaultResponses';
import { ResponseCodes } from '@lib/api/responseCodes';
import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';
import { Queries } from '@lib/api/queries'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<BaseAPI.RequestResponse<DTOs.ProjectGet[] | DTOs.ProjectGet | null>>
)
{
	const session = await getSession({ req });
	if (!session || !session.user)
	{
		return res.status(ResponseCodes.Unauthorized).json(DefaultResponses.unathorized);
	}

	try
	{
		if (req.method == "GET")
		{
			const query: Queries = new Queries();
			const responseGET = await query.getProjects();
			return res.status(responseGET.status).json(responseGET);
		}

		if (req.method == "PUT")
		{
			const projectPUT: DTOs.ProjectUpdate = req.body;
			const query: Queries = new Queries();
			const responsePUT = await query.updateProject({
				projectID: projectPUT.projectID,
				projectName: projectPUT.projectName,
				accessToken: projectPUT.accessToken,
				isActive: projectPUT.isActive
			});
			return res.status(responsePUT.status).json(responsePUT);
		}

		if (req.method == "POST")
		{
			const query: Queries = new Queries();
			const responsePOST = await query.createProject(req.body.projectName);
			return res.status(responsePOST.status).json(responsePOST);
		}

		if (req.method == "DELETE")
		{

			const query: Queries = new Queries();
			const responseDELETE = await query.deleteProject(req.body.projectID);
			return res.status(responseDELETE.status).json(responseDELETE);
		}
	}
	catch
	{
		return res.status(ResponseCodes.ServerError).json(DefaultResponses.serverError);
	}

	return res.status(ResponseCodes.NotFound).json(DefaultResponses.notFound);
}
