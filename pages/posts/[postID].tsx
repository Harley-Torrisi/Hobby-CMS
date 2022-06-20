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
import { Button, FloatingLabel, Form, FormCheck, InputGroup, Spinner } from "react-bootstrap";
import { BootstrapToastShow } from "@components/boostrapToast";

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
    const [postData, setPostData] = useState(props.postData);
    const [isSaving, setIsSaving] = useState(false);

    async function onSaveHandler()
    {
        setIsSaving(true);
        try
        {
            const postController: PostControllerInterface = new PostControllerCS();
            await postController.update(postData);
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
                        <InputElement.Large
                            placeholder={`Post Name ${postData.postName && "(" + postData.postName.length + " of 150)"}`}
                            value={postData.postName}
                            onChangeValue={(value) => setPostData({ ...postData, postName: value.substring(0, 150) })}
                        />
                        <InputElement.Large
                            placeholder={`Post Description ${postData.postDescription && "(" + postData.postDescription.length + " of 500)"}`}
                            value={postData.postDescription}
                            onChangeValue={(value) => setPostData({ ...postData, postDescription: value.substring(0, 500) })}
                        />
                    </div>
                    <div className="col col-3 flex-v gap-3">
                        <Button variant="success" size="lg" onClick={onSaveHandler}>Save Post</Button>

                        <InputElement.Large
                            type="date"
                            placeholder="Post Date"
                            value={formatDate(fromUnixTime(postData.postDate), 'yyyy-MM-dd', { locale: enAU })}
                            onChangeValue={(value) => setPostData({ ...postData, postDate: getUnixTime(new Date(value)) })}
                        />

                        <FloatingLabel label="Post Status">
                            <Form.Select value={postData.isPublished.toString()} onChange={(e) => setPostData({ ...postData, isPublished: e.target.value == "true" })}>
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