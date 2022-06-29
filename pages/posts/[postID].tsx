import { InputElement } from "@components/elementInput";
import { LayoutHead } from "@components/layoutHead";
import { LayoutMain } from "@components/layoutMain";
import { PostControllerCS, PostControllerInterface, PostControllerSS } from "@lib/controllers/postController";
import { NextPageCustom } from "@lib/extentions/appPropsCustom";
import { PostModel } from "@lib/models/post/postModel";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { format as formatDate, fromUnixTime, getUnixTime } from 'date-fns';
import { enAU } from "date-fns/locale";
import { Badge, Button, ButtonGroup, ButtonToolbar, FloatingLabel, Form, FormCheck, InputGroup, Ratio, Spinner } from "react-bootstrap";
import { BootstrapToastShow } from "@components/boostrapToast";
import { BlockEditors } from "@components/postBlockEditors";
import { PostBlockData } from "@lib/types/postBlockData";
import { InputMetaData } from "@components/inputMetaData";
import { InputTags } from "@components/inputTags";

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
    postData: PostModel
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
            (blockIndex == postDetails.postBlocks.length - 1 && direction == "down")
        );
    }

    function moveBlock(blockIndex: number, direction: "up" | "down")
    {
        if (!canBlockMove(blockIndex, direction)) return;
        const current = postDetails.postBlocks[blockIndex];
        const targetIndex = blockIndex + (direction == "up" ? -1 : 1);
        const target = postDetails.postBlocks[targetIndex];
        const postBlocks = [...postDetails.postBlocks];
        postBlocks[blockIndex] = target;
        postBlocks[targetIndex] = current;
        setPostDetails({ ...postDetails, postBlocks })
    }

    function removeBlock(blockIndex: number)
    {
        const postBlocks = [...postDetails.postBlocks];
        postBlocks.splice(blockIndex, 1);
        setPostDetails({ ...postDetails, postBlocks });
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
        const postBlocks = [...postDetails.postBlocks];
        postBlocks[blockIndex] = postBlock;
        setPostDetails({ ...postDetails, postBlocks })
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
        const postBlocks = [...postDetails.postBlocks];
        postBlocks.push(block);
        setPostDetails({ ...postDetails, postBlocks })
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
            {!isSaving && <>
                {/* Post Options */}
                <div className="row g-3">
                    <div className="col col-lg-5 col-md-6 col-12">
                        {/* Post Date */}
                        <InputElement.Large
                            type="date"
                            placeholder="Post Date"
                            value={formatDate(fromUnixTime(postDetails.postDate), 'yyyy-MM-dd', { locale: enAU })}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postDate: getUnixTime(new Date(value)) })}
                        />
                    </div>
                    <div className="col col-lg-5 col-md-6 col-12">
                        {/* Post Status */}
                        <FloatingLabel label="Post Status">
                            <Form.Select value={postDetails.isPublished.toString()} onChange={(e) => setPostDetails({ ...postDetails, isPublished: e.target.value == "true" })}>
                                <option value="true">Published</option>
                                <option value="false">Not Published</option>
                            </Form.Select>
                        </FloatingLabel>
                    </div>
                    <div className="col col-lg-2 col-12">
                        {/* Post Save */}
                        <Button className="h-100 w-100" variant="success" size="lg" onClick={onSaveHandler}>Save Post</Button>
                    </div>
                </div>
                <div className="row row-cols-1 g-3 mt-1">
                    <div className="col">
                        {/* Post Name */}
                        <InputElement.Large
                            placeholder={`Post Name ${postDetails.postName && "(" + postDetails.postName.length + " of 150)"}`}
                            value={postDetails.postName}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postName: value.substring(0, 150) })}
                        />
                    </div>
                    <div className="col">
                        {/* Post Description */}
                        <InputElement.Large
                            placeholder={`Post Description ${postDetails.postDescription && "(" + postDetails.postDescription.length + " of 500)"}`}
                            value={postDetails.postDescription}
                            onChangeValue={(value) => setPostDetails({ ...postDetails, postDescription: value.substring(0, 500) })}
                        />
                    </div>
                    <div className="col">
                        <InputTags
                            data={postDetails.tags}
                            onDataUpdate={(tags) => setPostDetails({ ...postDetails, tags })}
                        />
                    </div>
                    <div className="col">
                        {/* Meta Data */}
                        <InputMetaData
                            data={postDetails.metaData}
                            onDataChange={(x) => setPostDetails({ ...postDetails, metaData: x })}
                        />
                    </div>
                </div>
                <hr />
                {/* Post Data */}
                <div>
                    {/* Add Block Input */}
                    <InputGroup className="m-0 mb-3">
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
                    {postDetails.postBlocks.map((x, i) =>
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
            </>}
        </LayoutMain>
    </>)
}

export default Post