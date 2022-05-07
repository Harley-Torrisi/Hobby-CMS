import type { GetServerSideProps, NextPage } from 'next'
import { FormEvent, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { InputElement } from '@components/elementInput';
import { TasksEndpoint } from '@lib/api/tasksEndpoint';
import { getSession, signIn } from "next-auth/react"
import { BootstrapToastShow } from '@components/boostrapToast';

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const session = await getSession(context);
    if ((session && session.user) || (process.env.NODE_ENV !== "development"))
    {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    else
    {
        return {
            props: {
                targetType: process.env.DB_TARGET_TYPE
            },
        }
    }
}


const BuildDatabase: NextPage = ({ targetType }: any) =>
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [ready, setReady] = useState(false);

    function PasswordRepeatInValid(): boolean
    {
        return password != passwordRepeat && passwordRepeat != '';
    }

    useEffect(() =>
    {
        const ready = (
            username &&
            password &&
            passwordRepeat &&
            password == passwordRepeat &&
            accessKey
        ) ? true : false
        setReady(ready);
    }, [username, password, passwordRepeat, accessKey])

    async function submit(e: FormEvent)
    {
        e.preventDefault();
        if (!ready) return;

        const endpoint = new TasksEndpoint.Handler();
        const response = await endpoint.buildDatabase({
            username: username,
            password: password,
            accessKey: accessKey
        });

        if (response.succeeded)
        {
            signIn();
        }
        else
        {
            BootstrapToastShow({
                title: 'Unsuccessful',
                message: response.responseMessage,
                variant: "warning"
            });
            setReady(true);
        }
    }

    return (
        <main className='bg-dark vh-100 d-flex'>
            <Form
                method='POST'
                onSubmit={submit}
                className='bg-light p-4 m-auto d-flex flex-column gap-3 rounded-3'
            >
                <span className='h4 mx-auto text-success'>Create Database/User</span>
                <span className='h6 mx-auto text-uppercase pb-0'>With <u>{targetType}</u>.</span>
                <InputElement.Large placeholder='Username' name='username' value={username} onChangeValue={setUsername} />
                <InputElement.Large placeholder='Password' name='password' value={password} onChangeValue={setPassword} type="password" />
                {password &&
                    <InputElement.Large
                        placeholder='Repeat Password'
                        value={passwordRepeat}
                        onChangeValue={setPasswordRepeat}
                        type="password"
                        isInvalid={PasswordRepeatInValid()}
                        subText={PasswordRepeatInValid() ? 'password does not match' : undefined}
                    />
                }
                <InputElement.Large placeholder='Access Key' name='accessKey' value={accessKey} onChangeValue={setAccessKey} type="password" title={'DB_BUILD_SECRET'} subText='* from .env.DB_BUILD_SECRET' />
                {ready && <Button className='mt-2' type='submit'>Submit</Button>}
            </Form>
        </main>
    )
}

export default BuildDatabase
