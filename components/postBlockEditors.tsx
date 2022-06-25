import { PostBlockData } from "@lib/types/postBlockData";
import { useRef } from 'react';
import { Editor as TinyMceEditor } from '@tinymce/tinymce-react';

export namespace BlockEditors
{
    export enum BlockTypes
    {
        WYSIWYG = "WYSIWYG",
    }

    export const BlockTypesArray: BlockTypes[] = [BlockTypes.WYSIWYG];

    export interface Props
    {
        data: PostBlockData;
        onDataChange: (newData: PostBlockData) => void;
    }

    export function CreateEditorElement(props: Props, type: string): JSX.Element
    {
        const blockType = BlockTypesArray.find(x => x == type);
        if (typeof blockType === "undefined")
            return <div>Error: {type} is not a valid block type.</div>

        switch (blockType)
        {
            case BlockTypes.WYSIWYG:
                return <EditorWYSIWYG data={props.data} onDataChange={props.onDataChange} />
            default:
                return <div>Error: {type} has not yet been configured.</div>
        }
    }

    export function EditorWYSIWYG({ data, onDataChange }: Props)
    {
        // const editorRef = useRef<any>(null);
        return (
            <div>
                <TinyMceEditor
                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                    // onInit={(evt, editor) => editorRef.current = editor}
                    init={{
                        height: 400,
                        menubar: false,
                        branding: false,
                        // plugins: [
                        //     'advlist autolink lists link image charmap print preview anchor',
                        //     'searchreplace visualblocks code fullscreen',
                        //     'insertdatetime media table paste code help wordcount'
                        // ],
                        plugins: ['emoticons'],
                        toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help | emoticons',
                        // content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                    value={data['content']}
                    onEditorChange={(e) => onDataChange({ ...data, ['content']: e })}

                />
            </div>
        )
    }
}