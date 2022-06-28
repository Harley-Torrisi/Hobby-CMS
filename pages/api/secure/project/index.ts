import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { ApiResonseBuilder } from '@lib/helpers/internalApiHelper';
import { ProjectControllerSS } from '@lib/controllers/projectController';
import { ProjectModel } from '@lib/models/project/projectModel';

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
			const projects = await controller.getAll();
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "DELETE")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.delete(req.body.projectId);
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "PUT")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.update(req.body as ProjectModel);
			const response = ApiResonseBuilder.successGet(projects);
			return res.status(response.status).json(response);
		}

		if (req.method == "POST")
		{
			const controller = new ProjectControllerSS();
			const projects = await controller.create(req.body.projectName);
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
