import type { GetServerSideProps } from 'next'
import { NextPageCustom } from "@lib/appPropsCustom"
import { LayoutMain } from '@components/layoutMain'
import { LayoutHead } from '@components/layoutHead'
import { Queries } from '@lib/api/queries'
import { DefaultResponses } from '@lib/api/defaultResponses'
import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';
import { ChangeEvent, useState } from 'react'
import { Alert, Button, FormCheck, Modal } from 'react-bootstrap'
import { InputElement } from '@components/elementInput'
import { BootstrapToastShow } from '@components/boostrapToast';
import { PopuptInput } from '@components/popupInput'
import { PopupConfirm } from '@components/popupConfirm'

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const query: Queries = new Queries();
    const response = await query.getProjects();

    if (response.succeeded)
    {
        return {
            props: {
                projects: response.data
            }
        }
    }

    return DefaultResponses.redirect('/');

}

interface Props
{
    projects: DTOs.ProjectGet[];
}

const Home: NextPageCustom<Props> = (props) =>
{
    const [projects, setProjects] = useState<DTOs.ProjectGet[]>(props.projects);
    const [editingProject, setEditingProject] = useState<DTOs.ProjectGet | null>(null);
    const [actionWaiting, setActionWaiting] = useState(false);
    const newProjectInputRef = PopuptInput.GetRef();
    const deleteConfirmRef = PopupConfirm.GetRef();

    async function deleteProjectHandler(projectID: string)
    {
        deleteConfirmRef.current?.Show({
            header: "Are you sure you want to delete?",
            responseCallback: async (response) =>
            {
                if (response == PopupConfirm.ResponseTypes.Yes)
                {
                    const query: Queries = new Queries();
                    const resposne = await query.deleteProject(projectID);

                    if (resposne.succeeded)
                    {
                        BootstrapToastShow({
                            title: 'Complete',
                            message: 'Project has been deleted.',
                            variant: "info",
                            toastPosition: "top-center",
                        });

                        const index = projects.indexOf(
                            projects.find(x => x.projectID == projectID)!
                        );

                        projects.splice(index, 1);

                        setProjects([...projects]);
                    }
                    else
                    {
                        BootstrapToastShow({
                            title: 'Error',
                            message: resposne.responseMessage,
                            variant: "Error",
                            toastPosition: "top-center",
                        });
                    }
                }
            }
        });
    }

    async function newPorjectHandler()
    {
        newProjectInputRef.current?.Show({
            header: "Select New Project Name",
            placeholder: "Project Name",
            acceptEmptyResponse: false,
            onAccept: async (value: string | undefined) =>
            {
                if (typeof value === 'undefined') return;

                const query: Queries = new Queries();
                const resposne = await query.createProject(value);

                if (resposne.succeeded && resposne.data)
                {
                    BootstrapToastShow({
                        title: 'Complete',
                        message: 'Project has been added.',
                        variant: "success",
                        toastPosition: "top-center",
                    });

                    projects.push(resposne.data);
                    setProjects([...projects]);
                }
                else
                {
                    BootstrapToastShow({
                        title: 'Error',
                        message: resposne.responseMessage,
                        variant: "Error",
                        toastPosition: "top-center",
                    });
                }
            }
        });
    }

    function editProjectCloseHandler()
    {
        setEditingProject(null);
    }

    function editProjectOpenHandler(project: DTOs.ProjectGet)
    {
        setEditingProject(project);
    }

    async function editProjectSaveHandler()
    {
        if (!editingProject) return;

        if (!editingProject.projectName || !editingProject.accessToken)
        {
            BootstrapToastShow({
                title: 'Warning',
                message: 'Project Name or Access Token missing.',
                variant: "warning",
                toastPosition: "top-center",
            });
            return;
        }

        setActionWaiting(true);

        const query: Queries = new Queries();
        const resposne = await query.updateProject({ projectID: editingProject.projectID, projectName: editingProject.projectName, accessToken: editingProject.accessToken, isActive: editingProject.isActive });

        if (resposne.succeeded && resposne.data)
        {
            BootstrapToastShow({
                title: 'Complete',
                message: 'Project has been updated.',
                variant: "success",
                toastPosition: "top-center",
            });

            const index = projects.indexOf(
                projects.find(x => x.projectID == editingProject.projectID)!
            );

            projects[index] = resposne.data;

            setProjects([...projects]);
            setEditingProject(null);
        }
        else
        {
            BootstrapToastShow({
                title: 'Error',
                message: resposne.responseMessage,
                variant: "Error",
                toastPosition: "top-center",
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
                                    <span role="button" className='text-secondary' onClick={newPorjectHandler}>[Add]</span>
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
                                            <span role="button" className='text-primary' onClick={() => editProjectOpenHandler(x)}>[Show]</span>
                                            <span role="button" className='text-danger' onClick={() => deleteProjectHandler(x.projectID)}>[Delete]</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) || <tr><td className='p-1 pt-2 text-center'>...No Data...</td></tr>}
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

                        <InputElement.Large
                            placeholder='Acess Token'
                            name='accessToken'
                            value={editingProject.accessToken}
                            disabled={actionWaiting}
                            onChangeValue={(value) => setEditingProject({ ...editingProject, accessToken: value })}
                        />
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
export default Home
