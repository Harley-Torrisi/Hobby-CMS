import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"

import BootstrapToast, { BoostrapToastSetRef } from '@components/boostrapToast';

function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps)
{
  return (
    <SessionProvider session={session}>
      <BootstrapToast ref={BoostrapToastSetRef()}></BootstrapToast>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
