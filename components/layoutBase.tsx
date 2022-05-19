import { LayoutNav } from "./layoutNav";

export function LayoutBase({ children }: any)
{
    return (<>
        <LayoutNav />
        {children}
    </>)
}