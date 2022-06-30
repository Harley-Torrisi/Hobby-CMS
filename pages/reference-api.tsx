import { LayoutHead } from "@components/layoutHead";
import { LayoutMain } from "@components/layoutMain";
import { ProjectControllerSS } from "@lib/controllers/projectController";
import { NextPageCustom } from "@lib/extentions/appPropsCustom";
import { ProjectModel } from "@lib/models/project/projectModel";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Accordion, Badge, Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const controller = new ProjectControllerSS();
    const data = await controller.getAll();
    return {
        props: {
            projects: data.filter(x => x.isActive)
        } as PageProps
    }
}

interface PageProps
{
    projects: ProjectModel[]
}


const TestApi: NextPageCustom<PageProps> = (props) =>
{
    const [postListUrl, setPostListUrl] = useState('');
    const [postListTag, setPostListTag] = useState('');
    const [postListPageNumber, setPostListPageNumber] = useState('1');
    const [postListPageSize, setPostListPageSize] = useState('1');
    const [postListImageData, setPostListImageData] = useState(false);
    const [postListProject, setPostListProject] = useState(
        () => props.projects.length > 0 ? props.projects[0].accessToken : ''
    );

    useEffect(() =>
    {
        setPostListUrl(`${window.location.host}/api/public/post-list/${postListProject}${postListTag && "/" + postListTag}?pageNumber=${postListPageNumber}&pageSize=${postListPageSize}&includeImageData=${postListImageData}`);
    }, [postListProject, postListTag, postListPageNumber, postListPageSize, postListImageData])

    return (<>
        <LayoutHead title='Test API' />
        <LayoutMain>
            <h1>API Reference</h1>
            <hr />
            <Accordion flush>
                {/* Post List Call */}
                <Accordion.Item eventKey="0" className="border">
                    <Accordion.Button className="p-3">
                        <h6 className="m-0 flex gap-1 flex-align-center">
                            <Badge bg="success">GET</Badge>
                            <span className="fw-bold fontfam-sourcecodepro">
                                <span>/api/public/post-list/&#123;</span>
                                <span className="text-secondary">accessToken</span>
                                <span>&#125;/&#123;</span>
                                <span className="text-secondary">postTag</span>
                                <span>&#125;?</span>
                                <span className="text-secondary">[pageNumber]</span>
                                <span>&</span>
                                <span className="text-secondary">[pageSize]</span>
                                <span>&</span>
                                <span className="text-secondary">[includeImageData]</span>
                            </span>
                        </h6>
                    </Accordion.Button>
                    <Accordion.Body className="flex-v gap-2">
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>URL</InputGroup.Text>
                            <Form.Control disabled value={postListUrl} />
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>Access Token</InputGroup.Text>
                            <Form.Select value={postListProject} onChange={(e) => setPostListProject(e.target.value)}>
                                {!postListProject && <option value="" disabled></option>}
                                {props.projects.map((x, i) => <option key={i} value={x.accessToken}>{x.projectName}</option>)}
                            </Form.Select>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>Tag</InputGroup.Text>
                            <Form.Control value={postListTag} onChange={(e) => setPostListTag(e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>Page Number</InputGroup.Text>
                            <Form.Control type="number" value={postListPageNumber} onChange={(e) => setPostListPageNumber(e.target.value)} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>Page Size</InputGroup.Text>
                            <Form.Control type="number" value={postListPageSize} onChange={(e) => setPostListPageSize(e.target.value)} />
                        </InputGroup>
                        <Button variant="success" className="w-100 fw-bold">Give it a go!</Button>
                    </Accordion.Body>
                </Accordion.Item>
                {/* Post Item Call */}
                <Accordion.Item eventKey="1" className="border">
                    <Accordion.Button className="p-3">
                        <h6 className="m-0 flex gap-1 flex-align-center">
                            <Badge bg="success">GET</Badge>
                            <span className="fw-bold fontfam-sourcecodepro">
                                <span>/api/public/post-item/&#123;</span>
                                <span className="text-secondary">accessToken</span>
                                <span>&#125;/&#123;</span>
                                <span className="text-secondary">postId</span>
                                <span>&#125;?</span>
                                <span className="text-secondary">[includeImageData]</span>
                            </span>
                        </h6>
                    </Accordion.Button>
                    <Accordion.Body className="flex-v gap-2">
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>URL</InputGroup.Text>
                            <Form.Control disabled value={postListUrl} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text style={{ width: '8em' }}>Access Token</InputGroup.Text>
                            <Form.Select value={postListProject} onChange={(e) => setPostListProject(e.target.value)}>
                                {!postListProject && <option value="" disabled></option>}
                                {props.projects.map((x, i) => <option key={i} value={x.accessToken}>{x.projectName}</option>)}
                            </Form.Select>
                        </InputGroup>
                        <Button variant="success" className="w-100 fw-bold">Give it a go!</Button>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </LayoutMain>
    </>)
};

export default TestApi