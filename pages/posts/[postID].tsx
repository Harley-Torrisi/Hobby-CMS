import { InputElement } from "@components/elementInput";
import { LayoutHead } from "@components/layoutHead";
import { LayoutMain } from "@components/layoutMain";
import { PostControllerCS, PostControllerInterface, PostControllerSS } from "@lib/controllers/postController";
import { NextPageCustom } from "@lib/extentions/appPropsCustom";
import { PostEdit } from "@lib/models/postDTOs/postEdit";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { format as formatDate, fromUnixTime, getUnixTime } from 'date-fns';
import { enAU } from "date-fns/locale";
import { Badge, Button, ButtonGroup, ButtonToolbar, FloatingLabel, Form, FormCheck, InputGroup, Ratio, Spinner } from "react-bootstrap";
import { BootstrapToastShow } from "@components/boostrapToast";
import { BlockEditors } from "@components/postBlockEditors";
import { PostBlockData } from "@lib/types/postBlockData";
import { InputMetaData } from "@components/inputMetaData";

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const postID = context.query['postID'];
    const postController: PostControllerInterface = new PostControllerSS();
    const postData = await postController.get(postID as string);

    return {
        props: {
            postData: postData
        } as PageProps
    }
}

interface PageProps
{
    postData: PostEdit
}



const Post: NextPageCustom<PageProps> = (props) =>
{
    const [postDetails, setPostDetails] = useState(props.postData);
    const [isSaving, setIsSaving] = useState(false);
    const [newBlockType, setNewBlockType] = useState(BlockEditors.BlockTypes.WYSIWYG);

    function canBlockMove(blockIndex: number, direction: "up" | "down"): boolean
    {
        return !(
            (blockIndex == 0 && direction == "up") ||
            (blockIndex == postDetails.postData.length - 1 && direction == "down")
        );
    }

    function moveBlock(blockIndex: number, direction: "up" | "down")
    {
        if (!canBlockMove(blockIndex, direction)) return;
        const current = postDetails.postData[blockIndex];
        const targetIndex = blockIndex + (direction == "up" ? -1 : 1);
        const target = postDetails.postData[targetIndex];
        const postData = [...postDetails.postData];
        postData[blockIndex] = target;
        postData[targetIndex] = current;
        setPostDetails({ ...postDetails, postData })
    }

    function removeBlock(blockIndex: number)
    {
        const postData = [...postDetails.postData];
        postData.splice(blockIndex, 1);
        setPostDetails({ ...postDetails, postData });
    }

    async function onSaveHandler()
    {
        setIsSaving(true);
        try
        {
            const postController: PostControllerInterface = new PostControllerCS();
            await postController.update(postDetails);
            BootstrapToastShow({
                title: 'Complete', message: 'Post has been updated.', variant: "success", toastPosition: "top-center", duration: 1000
            });
        }
        catch (error: any)
        {
            BootstrapToastShow({
                title: 'Error', message: error, variant: "danger", toastPosition: "top-center",
            });
        }

        setIsSaving(false);
    }

    function onBlockEditHandler(blockIndex: number, postBlock: PostBlockData)
    {
        const postData = [...postDetails.postData];
        postData[blockIndex] = postBlock;
        setPostDetails({ ...postDetails, postData })
    }

    function onAddNewBlockHandler()
    {
        let block: PostBlockData = {};
        switch (newBlockType)
        {
            case BlockEditors.BlockTypes.WYSIWYG:
                block['type'] = BlockEditors.BlockTypes.WYSIWYG;
                block['content'] = '';
                break;
            default: throw "Cannot add block, type not configured";
        }
        const postData = [...postDetails.postData];
        postData.push(block);
        setPostDetails({ ...postDetails, postData })
    }

    return (<>
        <LayoutHead title={`Post - ${props.postData.postName}`} />
        <LayoutMain>
            <h1>Post Edit</h1>
            <hr />
            {isSaving &&
                <div className="text-center flex flex-align-center flex-center gap-3 text-primary">
                    <Spinner animation="border"></Spinner>
                    <h5 className="m-0">Saving</h5>
                </div>
            }
            {!isSaving &&
                <div className="row">
                    <div className="col col-9 flex-v gap-3">
                        {/* Post Name */}
                        <InputElement.Large
                            placeholder={`Post Name ${postDetails.postName && "(" + postDetails.postName.length + " of 150)"}`}
                            value={postDetails.postName}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postName: value.substring(0, 150) })}
                        />
                        {/* Post Description */}
                        <InputElement.Large
                            placeholder={`Post Description ${postDetails.postDescription && "(" + postDetails.postDescription.length + " of 500)"}`}
                            value={postDetails.postDescription}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postDescription: value.substring(0, 500) })}
                        />
                        {/* Meta Data */}
                        <InputMetaData
                            data={postDetails.metaTags}
                            onDataChange={(data) => setPostDetails({ ...postDetails, metaTags: data })}
                        />
                        <hr />
                        {/* Add Block Input */}
                        <InputGroup className="m-0">
                            <FloatingLabel label="Add Block" className="flex-grow">
                                <Form.Select
                                    value={newBlockType}
                                    onChange={(e) => setNewBlockType(BlockEditors.BlockTypes[e.target.value as keyof typeof BlockEditors.BlockTypes])}
                                >
                                    {BlockEditors.BlockTypesArray.map((x, i) => <option key={i} value={x}>{x}</option>)}
                                </Form.Select>
                            </FloatingLabel>
                            <Button variant="primary" size="lg" style={{ width: '3em' }} onClick={onAddNewBlockHandler}>+</Button>
                        </InputGroup>
                        {/* Post Blocks */}
                        {postDetails.postData.map((x, i) =>
                            <div key={i} className='border rounded'>
                                {/* Block Controller */}
                                <div className="flex flex-between flex-align-center gap-1 p-1 border rounded-top">
                                    <Badge bg="light" text="secondary" className="flex flex-align-center">{x['type']}</Badge>
                                    <ButtonToolbar className="gap-1">
                                        <ButtonGroup>
                                            <Button variant="dark" size="sm" disabled={!canBlockMove(i, "up")} onClick={() => moveBlock(i, "up")}>
                                                <i className="bi bi-chevron-up"></i>
                                            </Button>
                                            <Button variant="dark" size="sm" disabled={!canBlockMove(i, "down")} onClick={() => moveBlock(i, "down")}>
                                                <i className="bi bi-chevron-down"></i>
                                            </Button>
                                        </ButtonGroup>
                                        <ButtonGroup>
                                            <Button variant="danger" size="sm" onClick={() => removeBlock(i)}>
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>
                                </div>
                                {/* Block Specific */}
                                {BlockEditors.CreateEditorElement({ data: x, onDataChange: (e) => onBlockEditHandler(i, e) }, x['type'])}
                            </div>
                        )}
                    </div>
                    <div className="col col-3 flex-v gap-3">
                        {/* Post Save */}
                        <Button variant="success" size="lg" onClick={onSaveHandler}>Save Post</Button>
                        {/* Post Date */}
                        <InputElement.Large
                            type="date"
                            placeholder="Post Date"
                            value={formatDate(fromUnixTime(postDetails.postDate), 'yyyy-MM-dd', { locale: enAU })}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postDate: getUnixTime(new Date(value)) })}
                        />
                        {/* Post Status */}
                        <FloatingLabel label="Post Status">
                            <Form.Select value={postDetails.isPublished.toString()} onChange={(e) => setPostDetails({ ...postDetails, isPublished: e.target.value == "true" })}>
                                <option value="true">Published</option>
                                <option value="false">Not Published</option>
                            </Form.Select>
                        </FloatingLabel>
                    </div>
                </div>
            }
        </LayoutMain>
    </>)
}

export default Post