import type { GetServerSideProps } from 'next'
import { NextPageCustom } from "@lib/extentions/appPropsCustom"
import { LayoutMain } from '@components/layoutMain'
import { LayoutHead } from '@components/layoutHead'
import { ChangeEvent, useState } from 'react'
import { Alert, Button, FormCheck, Modal } from 'react-bootstrap'
import { InputElement } from '@components/elementInput'
import { BootstrapToastShow } from '@components/boostrapToast';
import { PopuptInput } from '@components/popupInput'
import { PopupConfirm } from '@components/popupConfirm'
import { ProjectControllerInterface, ProjectControllerSS, ProjectControllerCS } from '@lib/controllers/projectController'
import { ProjectModel } from '@lib/models/project/projectModel'

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const controller: ProjectControllerInterface = new ProjectControllerSS();
    const data = await controller.getAll();
    return {
        props: { projects: data } as PageProps
    }
}

interface PageProps
{
    projects: ProjectModel[]
}

const Projects: NextPageCustom<PageProps> = (props) =>
{
    const [projects, setProjects] = useState<ProjectModel[]>(props.projects);
    const [editingProject, setEditingProject] = useState<ProjectModel | null>(null);
    const [actionWaiting, setActionWaiting] = useState(false);
    const [showActiveProjectToken, setShowActiveProjectToken] = useState(false);
    const newProjectInputRef = PopuptInput.GetRef();
    const deleteConfirmRef = PopupConfirm.GetRef();

    async function deleteProjectHandler(projectId: string)
    {
        deleteConfirmRef.current?.Show({
            header: "Are you sure you want to delete?",
            responseCallback: async (response) =>
            {
                if (response == PopupConfirm.ResponseTypes.Yes)
                {
                    try
                    {
                        const controller: ProjectControllerInterface = new ProjectControllerCS();
                        await controller.delete(projectId);

                        BootstrapToastShow({
                            title: 'Complete', message: 'Project has been deleted.',
                            variant: "info", toastPosition: "top-center",
                        });

                        const index = projects.indexOf(projects.find(x => x.projectID == projectId)!);
                        projects.splice(index, 1);
                        setProjects([...projects]);
                    }
                    catch (error: any)
                    {
                        BootstrapToastShow({
                            title: 'Error', message: error,
                            variant: "danger", toastPosition: "top-center",
                        });
                    }

                }
            }
        });
    }

    async function newProjectHandler()
    {
        newProjectInputRef.current?.Show({
            header: "Select New Project Name",
            placeholder: "Project Name",
            acceptEmptyResponse: false,
            onAccept: async (value: string | undefined) =>
            {
                if (typeof value === 'undefined') return;

                try
                {
                    const controller: ProjectControllerInterface = new ProjectControllerCS();
                    const response = await controller.create(value);

                    BootstrapToastShow({
                        title: 'Complete', message: 'Project has been added.',
                        variant: "success", toastPosition: "top-center",
                    });

                    projects.push(response);
                    setProjects([...projects]);
                    setEditingProject(response);
                }
                catch (error: any)
                {
                    BootstrapToastShow({
                        title: 'Error', message: error,
                        variant: "danger", toastPosition: "top-center",
                    });
                }
            }
        });
    }

    function editProjectCloseHandler()
    {
        setShowActiveProjectToken(false);
        setEditingProject(null);
    }

    function editProjectOpenHandler(projectId: string)
    {
        setShowActiveProjectToken(false);
        setEditingProject(projects.find(x => x.projectID == projectId)!);
    }

    async function editProjectSaveHandler()
    {
        if (!editingProject) return;

        if (!editingProject.projectName || !editingProject.accessToken)
        {
            BootstrapToastShow({
                title: 'Warning', message: 'Project Name or Access Token missing.',
                variant: "warning", toastPosition: "top-center",
            });
            return;
        }

        setActionWaiting(true);

        try
        {
            const controller: ProjectControllerInterface = new ProjectControllerCS();
            await controller.update(editingProject);

            BootstrapToastShow({
                title: 'Complete',
                message: 'Project has been updated.',
                variant: "success",
                toastPosition: "top-center",
            });

            const index = projects.indexOf(projects.find(x => x.projectID == editingProject.projectID)!);
            projects[index] = editingProject;
            setProjects([...projects]);
            setEditingProject(null);
        }
        catch (error: any)
        {
            BootstrapToastShow({
                title: 'Error', message: error,
                variant: "danger", toastPosition: "top-center",
            });
        }
        setActionWaiting(false);
    }

    return (
        <>
            <LayoutHead title='Projects' />
            <LayoutMain>
                <h1>Projects</h1>
                <hr />
                <Alert variant='warning'>
                    Note: Actions to delete project will be cancelled if a Post is still associated. Its would be better to diable instead.
                </Alert>
                {/* Projects List */}
                <table className='table table-hover table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>
                                <div className='flex'>
                                    <span className='flex-grow'>
                                        Project Name
                                    </span>
                                    <span role="button" className='text-secondary' onClick={newProjectHandler}>[Add]</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 && projects.map((x, i) =>
                            <tr key={i}>
                                <td className='ev-hover'>
                                    <div className='flex'>
                                        <span className="flex-grow">
                                            {!x.isActive && <span title='Project Inactive' className='text-warning me-2 bi bi-exclamation-triangle-fill'></span>}
                                            {x.projectName}
                                        </span>
                                        <div className='ev-trigger-nth-d-flex gap-2'>
                                            <span role="button" className='text-primary' onClick={() => editProjectOpenHandler(x.projectID)}>[Show]</span>
                                            <span role="button" className='text-danger' onClick={() => deleteProjectHandler(x.projectID)}>[Delete]</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) || <tr><td className='p-1 pt-2 text-center'>...No Projects...</td></tr>}
                    </tbody>
                </table>
            </LayoutMain>
            {/* Edit Modal */}
            <Modal centered show={editingProject != null} onHide={editProjectCloseHandler} backdrop="static" keyboard={false}>
                <Modal.Body className='flex-v gap-3'>
                    {editingProject && <>
                        <InputElement.Large
                            placeholder='Project Name'
                            name='projectName'
                            value={editingProject.projectName}
                            disabled={actionWaiting}
                            onChangeValue={(value) => setEditingProject({ ...editingProject, projectName: value })}
                        />

                        <div className="flex gap-2 flex-align-center">
                            <InputElement.Large
                                placeholder='Acess Token'
                                name='accessToken'
                                value={editingProject.accessToken}
                                disabled={actionWaiting}
                                onChangeValue={(value) => setEditingProject({ ...editingProject, accessToken: value })}
                                type={showActiveProjectToken ? "text" : "password"}
                                className="flex-grow"
                            />
                            <i className={`ev-hover ev-trigger-hand me-1 bi bi-${showActiveProjectToken ? "eye-slash" : "eye"}`} style={{ fontSize: '2rem' }}
                                onClick={() => setShowActiveProjectToken(!showActiveProjectToken)}></i>
                        </div>

                        <div>
                            <FormCheck
                                label="Is Active" type="switch" id='editProjectActiveSwitch'
                                checked={editingProject.isActive}
                                disabled={actionWaiting}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => setEditingProject({
                                    ...editingProject, isActive: event.target.checked
                                })}
                            />
                        </div>
                    </>}
                </Modal.Body>
                <Modal.Footer className='flex flex-between'>
                    <Button variant="secondary" onClick={editProjectCloseHandler} size="sm" disabled={actionWaiting}>
                        Close
                    </Button>

                    <Button variant="success" onClick={editProjectSaveHandler} size="sm" disabled={actionWaiting}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Create Modal */}
            <PopuptInput.Element ref={newProjectInputRef}></PopuptInput.Element>
            {/* Delete Confirm */}
            <PopupConfirm.Element ref={deleteConfirmRef}></PopupConfirm.Element>
        </>
    )
}
export default Projects
