import type { GetServerSideProps, NextPage } from 'next'
import { getSession, signOut } from 'next-auth/react'
import Head from 'next/head'

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const session = await getSession(context);
    if (!session || !session.user)
    {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        }
    }
    else
    {
        return {
            props: {},
        }
    }
}

const Home: NextPage = () =>
{
    return (
        <div>
            <Head>
                <title>Hobby-CMS</title>
                <meta name="description" content="A basic Headless CMS, for things such as a portfolio." />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </Head>

            <main>
                <button className='btn btn-primary' onClick={() => signOut()}>Sign Out</button>
                <h1>Home Page</h1>
            </main>
        </div>
    )
}

export default Home
