import AuthTemp from '@components/auth-temp'
import type { NextPage } from 'next'
import Head from 'next/head'

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
        <AuthTemp />
        <h1></h1>
        <h1>Home Page</h1>

      </main>
    </div>
  )
}

export default Home
