import Head from "next/head"

interface LayoutHeadProps
{
    title?: string
    titlePrefix?: string
    children?: any
}

export function LayoutHead({ title, titlePrefix = process.env.NEXT_PUBLIC_SITE_NAME, children }: LayoutHeadProps)
{
    return (
        <Head>
            <title>{titlePrefix}{title && ` - ${title}`}</title>
            {children}
        </Head>
    )
}