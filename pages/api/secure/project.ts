import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { ApiResonseBuilder } from '@lib/helpers/internalApiHelper';
import { ProjectControllerSS } from '@lib/controllers/projectController';
import { ProjectDeleteRequest } from '@lib/models/projectDTOs/projectDeleteRequest';
import { ProjectUpdateRequest } from '@lib/models/projectDTOs/projectUpdateRequest';
import { ProjectCreateRequest } from '@lib/models/projectDTOs/projectCreateRequest';

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
			const controller = new ProjectControllerSS();
			const projects = await controller.getAllProjects();
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "DELETE")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.deteProject(req.body as ProjectDeleteRequest);
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "PUT")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.updateProject(req.body as ProjectUpdateRequest);
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "POST")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.createProject(req.body as ProjectCreateRequest);
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
