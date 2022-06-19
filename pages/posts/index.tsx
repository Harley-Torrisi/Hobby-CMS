import { BootstrapToastShow } from "@components/boostrapToast";
import { InputElement } from "@components/elementInput";
import { LayoutHead } from "@components/layoutHead";
import { LayoutMain } from "@components/layoutMain";
import { PostControllerCS, PostControllerInterface, PostControllerSS } from "@lib/controllers/postController";
import { ProjectControllerInterface, ProjectControllerSS } from "@lib/controllers/projectController";
import { NextPageCustom } from "@lib/extentions/appPropsCustom";
import { PostCreate } from "@lib/models/postDTOs/postCreate";
import { PostListItem } from "@lib/models/postDTOs/postListItem";
import { ProjectOptionItem } from "@lib/models/projectDTOs/projectOptionItem";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, FloatingLabel, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { format as formtDate, fromUnixTime } from 'date-fns';
import Enumberable from 'linq';

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const projectController: ProjectControllerInterface = new ProjectControllerSS();
    const projectData = await projectController.getOptionItems();

    const postController: PostControllerInterface = new PostControllerSS();
    const postData = await postController.getPostListItems();

    return {
        props: {
            projectOptions: projectData,
            postList: postData
        } as PageProps
    }
}

interface PageProps
{
    projectOptions: ProjectOptionItem[]
    postList: PostListItem[]
}

const Posts: NextPageCustom<PageProps> = (props) =>
{
    const [selectedProject, setSelectedProject] = useState('');
    const [newPostDetails, setNewPostDetails] = useState<PostCreate | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    function onCreatePostStartHandler()
    {
        if (props.projectOptions.length == 0)
        {
            BootstrapToastShow({ title: "Warning", message: "Cannot Create Post's Until A Project Has Been Created", variant: "warning" });
            return;
        }

        setNewPostDetails({ postName: '', projectId: selectedProject || props.projectOptions[0].projectId, userId: session?.user.userName ?? "" });
    }

    async function onCreatePostSaveHandler()
    {
        if (!newPostDetails) return;
        if (!newPostDetails.postName || !newPostDetails.projectId)
        {
            BootstrapToastShow({ title: "Warning", message: "All Fields Required", variant: "warning" });
            return;
        }

        setIsCreating(true);

        try
        {
            const controller: PostControllerInterface = new PostControllerCS();
            const response = await controller.create(newPostDetails);

            BootstrapToastShow({
                title: 'Complete', message: 'Post has been added.',
                variant: "success", toastPosition: "top-center",
            });

            router.push(`/posts/${response.PostID}`);
        }
        catch (error: any)
        {
            BootstrapToastShow({
                title: 'Error', message: error,
                variant: "danger", toastPosition: "top-center",
            });
        }

        setIsCreating(false);
    }

    return (<>
        <LayoutHead title='Posts' />
        <LayoutMain>
            <h1>Posts</h1>
            <hr />
            <div className="flex flex-betweeen gap-3">
                <InputGroup>
                    <InputGroup.Text>Project Filter</InputGroup.Text>
                    <Form.Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="">All Projects</option>
                        {props.projectOptions.map((x, i) => <option key={i} value={x.projectId}>{x.projectName}</option>)}
                    </Form.Select>
                </InputGroup>
                <Button variant="success" onClick={onCreatePostStartHandler}>Create</Button>
            </div>
            <hr />
            <Table bordered hover striped>
                <thead>
                    <tr className="text-nowrap">
                        <th style={{ width: '0%' }}>Status</th>
                        <th style={{ width: '100%' }}>Post Name</th>
                        <th>Project</th>
                        <th>Post Date</th>
                    </tr>
                </thead>
                <tbody>
                    {Enumberable.from(props.postList).orderByDescending(x => x.postDate).toArray().map((x, i) =>
                        <tr key={i}
                            className="ev-hover ev-trigger-hand text-nowrap"
                            onClick={() => router.push(`/posts/${x.postId}`)}
                        >
                            <td>{x.isPublished
                                && <span className="text-success">Published</span>
                                || <span className="text-danger">Not Published</span>
                            }</td>
                            <td><span className="text-wrap">{x.postName}</span></td>
                            <td>{props.projectOptions.find(p => p.projectId == x.projectId)?.projectName}</td>
                            <td>{formtDate(fromUnixTime(x.postDate), 'PPP')}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </LayoutMain>
        <Modal show={newPostDetails != null} onHide={() => setNewPostDetails(null)} backdrop="static" keyboard={false} centered>
            <Modal.Body className='flex-v gap-3'>
                {newPostDetails && <>
                    <InputElement.Large
                        placeholder='Post Name'
                        value={newPostDetails.postName}
                        disabled={isCreating}
                        onChangeValue={(value) => setNewPostDetails({ ...newPostDetails, postName: value })}
                    />
                    <FloatingLabel label="Project" title="Project">
                        <Form.Select value={newPostDetails.projectId} onChange={(e) => setNewPostDetails({ ...newPostDetails, projectId: e.target.value })}>
                            {props.projectOptions.map((x, i) => <option key={i} value={x.projectId}>{x.projectName}</option>)}
                        </Form.Select>
                    </FloatingLabel>
                </>}
            </Modal.Body>
            <Modal.Footer className='flex flex-between'>
                <Button variant="secondary" onClick={() => setNewPostDetails(null)} size="sm" disabled={isCreating}>
                    Close
                </Button>

                <Button variant="success" onClick={onCreatePostSaveHandler} size="sm" disabled={isCreating}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}

export default Posts;