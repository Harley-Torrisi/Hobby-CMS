import Styles from '@styles/components/inputTags.module.scss';
import { useState } from 'react';
import { Badge, Form } from 'react-bootstrap';

interface InputTagsProps
{
    data: string[]
    onDataUpdate: (data: string[]) => void
}

export function InputTags({ data, onDataUpdate }: InputTagsProps)
{
    const [isFocused, setIsFocused] = useState(false);

    const [inputText, setInputText] = useState('');

    function onFocusHandler()
    {
        setInputText(data.join(', '));
        setIsFocused(true);
    }

    function onBlurHandler()
    {
        setInputText('');
        const results = Array.from(new Set(inputText
            .split(',')
            .map(x => x.trim().toUpperCase())
            .filter(x => x != '')
        ));
        onDataUpdate(results);
        setIsFocused(false);
    }

    function removeTag(tag: string)
    {
        const newSet = [...data];
        const index = newSet.indexOf(tag);
        newSet.splice(index, 1);
        onDataUpdate(newSet);
    }

    return (
        <div className={`${Styles.Container}`}>
            <div className={Styles.Header} custom-expand={(!isFocused && data.length == 0) ? "true" : "false"}>
                <label className={Styles.HeaderText}>
                    <span>Post Tags</span>
                    <i className="bi bi-question-circle ms-1 ev-hover ev-trigger-hand" title='Seperate by coma.' onClick={() => alert('Seperate by coma.')}></i>
                </label>
            </div>
            <div className={Styles.Content}>
                <Form.Control
                    className={Styles.Input}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                />
                {!isFocused &&
                    <div className={Styles.BadgeContainer}>
                        {data.map((x, i) =>
                            <Badge key={i} pill className='flex flex-center flex-align-center' bg="secondary">
                                <span>{x}</span>
                                <i className="bi bi-x-lg ms-1 ev-hover ev-trigger-hand" onClick={() => removeTag(x)}></i>
                            </Badge>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}