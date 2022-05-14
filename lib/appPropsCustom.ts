import type { AppProps } from 'next/app'
import { NextPage } from "next";

/** Extends AppProps to allow for additional information in 'NextPageAuthed' which extends 'NextPage' */
export type AppPropsCustom = AppProps & {
    Component: NextPageCustom
}

/** Extends NextPage, adding an authentication layaer to ignore login routes if desired*/
export type NextPageCustom<P = {}, IP = P> = NextPage<IP, P> & {
    isPublic?: boolean
}
