import type { GetServerSideProps } from 'next'
import { signOut } from 'next-auth/react'
import Head from 'next/head'
import { NextPageCustom } from "@lib/appPropsCustom"

const Home: NextPageCustom = () =>
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
