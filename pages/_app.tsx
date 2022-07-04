import '../styles/globals.scss'
import { SessionProvider, useSession } from "next-auth/react"
import { AppPropsCustom } from '@lib/extentions/appPropsCustom';
import { LoadingSkeleton } from '@components/loadingSkeleton';
import { LayoutBase } from '@components/layoutBase';
import { LayoutMain } from '@components/layoutMain';
import Head from 'next/head';
import { ThemeProvider } from '@components/themeProvider';
import { SnackbarProvider } from 'notistack';

function MyApp({
	Component,
	pageProps: { session, ...pageProps }
}: AppPropsCustom)
{


	function getSessionView(): JSX.Element
	{
		if (Component.isPublic) return <Component {...pageProps} />
		else return (
			<LayoutBase>
				<Auth>
					<Component {...pageProps} />
				</Auth>
			</LayoutBase>
		)
	}


	return (
		<>
			<Head>
				{/* MUI Meta  */}
				{/* https://mui.com/material-ui/getting-started/usage/ */}
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<ThemeProvider>
				<SnackbarProvider>
					<SessionProvider session={session}>
						{getSessionView()}
					</SessionProvider>
				</SnackbarProvider>
			</ThemeProvider>
		</>
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