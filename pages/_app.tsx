import '../styles/globals.scss'
import { SessionProvider, useSession } from "next-auth/react"
import BootstrapToast, { BoostrapToastSetRef } from '@components/boostrapToast';
import { AppPropsCustom } from '@lib/appPropsCustom';
import LoadingSkeleton from '@components/LoadingSkeleton';

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsCustom)
{
  return (
    <SessionProvider session={session}>
      <BootstrapToast ref={BoostrapToastSetRef()}></BootstrapToast>
      {Component.isPublic && <Component {...pageProps} /> || <Auth><Component {...pageProps} /></Auth>}
    </SessionProvider>
  )
}
export default MyApp

function Auth({ children }: any)
{
  const { status } = useSession({ required: true })
  return status === 'loading' ? <LoadingSkeleton /> : children;
}