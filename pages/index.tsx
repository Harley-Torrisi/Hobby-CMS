import type { GetServerSideProps } from 'next'
import { NextPageCustom } from "@lib/extentions/appPropsCustom"
import { LayoutMain } from '@components/layoutMain'
import { LayoutHead } from '@components/layoutHead'

const Home: NextPageCustom = () =>
{
    return (
        <>
            <LayoutHead title='Home' />
            <LayoutMain>
                <h1>Home Page</h1>
            </LayoutMain>
        </>
    )
}
export default Home
