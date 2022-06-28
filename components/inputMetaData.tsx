import { DictionaryS } from "@lib/types/dictionary"
import Styles from "@styles/components/inputMetaData.module.scss"
import { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { BootstrapToastShow } from "./boostrapToast";

interface InputMetaDataProps
{
    data: DictionaryS<string>;
    onDataChange: (data: DictionaryS<string>) => void;
}

export function InputMetaData(props: InputMetaDataProps)
{
    const [newKeyText, setNewKeyText] = useState('');

    function getKeys(): string[]
    {
        return Object.keys(props.data);
    }

    function updateKeyName(currentValue: string, newValue: string)
    {
        if (getKeys().includes(newValue))
        {
            BootstrapToastShow({ title: 'Cannot Do That.', message: 'Key Already Exists.', variant: 'warning' });
            return;
        }

        const newData: DictionaryS<string> = {};
        getKeys().forEach((k) =>
            newData[k == currentValue ? newValue : k] = props.data[k]
        );
        props.onDataChange(newData);
    }

    function updateKeyValue(key: string, value: string)
    {
        const newData = { ...props.data };
        newData[key] = value;
        props.onDataChange(newData);
    }

    function addNewKey()
    {
        if (getKeys().includes(newKeyText))
        {
            BootstrapToastShow({ title: 'Cannot Do That.', message: 'Key Already Exists.', variant: 'warning' });
            return;
        }

        const newData = { ...props.data };
        newData[newKeyText] = '';
        props.onDataChange(newData);
        setNewKeyText('')
    }

    function deleteKey(key: string)
    {
        const newData: DictionaryS<string> = {};
        getKeys().forEach((k) =>
            key != k && (newData[k] = props.data[k])
        );
        props.onDataChange(newData);
    }

    return (
        <div className={`border rounded ${Styles.Container}`}>
            <div className={Styles.Header}>
                <label className={Styles.HeaderText}>Meta Data</label>
            </div>
            <div className={Styles.Content}>
                <Table hover size="sm" className="m-0">
                    <tbody className={Styles.ContentTableBody}>
                        {getKeys().map((x, i) =>
                            <tr key={i}>
                                <td className="text-center ps-2">
                                    <i className={`bi bi-${x} el-hand text-secondary`}></i>
                                </td>
                                <td>
                                    <Form.Control value={x} onChange={(e) => updateKeyName(x, e.target.value)} size="sm" />
                                </td>
                                <td>:</td>
                                <td>
                                    <Form.Control value={props.data[x]} onChange={(e) => updateKeyValue(x, e.target.value)} size="sm" />
                                </td>
                                <td>:</td>
                                <td>
                                    <i className="bi bi-trash text-danger text-start pe-2 ev-hover ev-trigger-hand" onClick={() => deleteKey(x)}></i>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td className="text-center ps-2">
                                <i className={`bi bi-${newKeyText} el-hand text-secondary`}></i>
                            </td>
                            <td>
                                <Form.Control placeholder="Add New" value={newKeyText} onChange={(e) => setNewKeyText(e.target.value)} size="sm" />
                            </td>
                            <td>:</td>
                            <td>
                                {newKeyText &&
                                    <i className="bi bi-plus-square-dotted text-success ev-hover ev-trigger-hand" onClick={addNewKey}></i>
                                }
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    )
}