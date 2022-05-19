import '../styles/globals.scss'
import { SessionProvider, useSession } from "next-auth/react"
import BootstrapToast, { BoostrapToastSetRef } from '@components/boostrapToast';
import { AppPropsCustom } from '@lib/appPropsCustom';
import { LoadingSkeleton } from '@components/loadingSkeleton';
import { LayoutBase } from '@components/layoutBase';
import { SSRProvider } from 'react-bootstrap';
import { LayoutMain } from '@components/layoutMain';

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsCustom)
{
  return (
    <SSRProvider>
      <SessionProvider session={session}>
        <BootstrapToast ref={BoostrapToastSetRef()}></BootstrapToast>
        {Component.isPublic && <Component {...pageProps} /> ||
          <LayoutBase>
            <Auth><Component {...pageProps} /></Auth>
          </LayoutBase>
        }
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
    return <LayoutMain><LoadingSkeleton /></LayoutMain>
  }

  return children
}