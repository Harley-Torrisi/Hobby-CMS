import type { GetServerSideProps } from 'next'
import { NextPageCustom } from "@lib/appPropsCustom"
import { LayoutMain } from '@components/layoutMain'
import { LayoutHead } from '@components/layoutHead'

const Home: NextPageCustom = () =>
{
    return (
        <>
            <LayoutHead title='Projects' />
            <LayoutMain>
                <h1>Projects</h1>
            </LayoutMain>
        </>
    )
}
export default Home
