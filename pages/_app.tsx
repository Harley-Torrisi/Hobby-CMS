import '../styles/globals.scss'
import { SessionProvider, useSession } from "next-auth/react"
import BootstrapToast, { BoostrapToastSetRef } from '@components/boostrapToast';
import { AppPropsCustom } from '@lib/appPropsCustom';
import LoadingSkeleton from '@components/loadingSkeleton';
import Layout from '@components/layout';
import { SSRProvider } from 'react-bootstrap';

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsCustom)
{
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <BootstrapToast ref={BoostrapToastSetRef()}></BootstrapToast>
        <Layout>
          {Component.isPublic && <Component {...pageProps} /> || <Auth><Component {...pageProps} /></Auth>}
        </Layout>
      </SessionProvider>
    </SSRProvider>
  )
}
export default MyApp

function Auth({ children }: any)
{
  const { status } = useSession({ required: true })

  if (status === 'loading')
  {
    return <LoadingSkeleton />
  }

  return children
}