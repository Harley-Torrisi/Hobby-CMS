import { NextPageCustom } from "@lib/extentions/appPropsCustom"
import { LayoutMain } from '@components/layoutMain'
import { LayoutHead } from '@components/layoutHead'
import { getSession, useSession } from "next-auth/react"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    if (process.env.NODE_ENV !== "development")
    {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    return {
        props: {}
    }
}

const Session: NextPageCustom = () =>
{
    const { data: session } = useSession();

    console.log(session);
    return (
        <>
            <LayoutHead title='Session' />
            <LayoutMain>
                <h1>Session</h1>
                <hr />
                {session && <textarea readOnly className="w-100" style={{ minHeight: '180px' }} value={JSON.stringify(session, null, 2)}></textarea>}
            </LayoutMain>
        </>
    )
}
export default Session
