import React, { ReactElement, useImperativeHandle, useRef, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { ToastPosition } from "react-bootstrap/esm/ToastContainer";

export const BootstrapToast = React.forwardRef<RefCallbackCustom>((_, ref) =>
{
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useImperativeHandle(ref, () => new RefCallbackCustom(showHandler));

    async function showHandler(toastOptions: ToastOptions)
    {
        const x = [...toasts];
        x.push({
            ...toastOptions,
            ... {
                id: crypto.randomUUID()
            }
        });
        setToasts(x);
    }

    async function closeHandler(id: string)
    {
        const toast = toasts.find(x => x.id == id);
        if (toast)
        {
            const x = [...toasts];
            x.splice(toasts.indexOf(toast), 1);
            setToasts(x);
        }
    }

    function DisplayToatsList(items: ToastItem[])
    {
        return items.map((x, _) =>
            <Toast key={x.id} onClose={() => closeHandler(x.id)} show={true} delay={x?.duration} autohide bg={x.variant}>
                <Toast.Header>
                    <strong className="me-auto">{x.title}</strong>
                </Toast.Header>
                <Toast.Body>{x.message}</Toast.Body>
            </Toast>
        )
    }

    return (
        <div title="bootstrap-toast-container">
            <ToastContainer position="top-start" className="ms-3 mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "top-start"))}
            </ToastContainer>
            <ToastContainer position="top-center" className="mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "top-center"))}
            </ToastContainer>
            <ToastContainer position="top-end" className="me-3 mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "top-end"))}
            </ToastContainer>
            <ToastContainer position="middle-start" className="ms-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "middle-start"))}
            </ToastContainer>
            <ToastContainer position="middle-center" >
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "middle-center"))}
            </ToastContainer>
            <ToastContainer position="middle-end" className="me-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "middle-end"))}
            </ToastContainer>
            <ToastContainer position="bottom-start" className="ms-3 mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "bottom-start"))}
            </ToastContainer>
            <ToastContainer position="bottom-center" className="mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "bottom-center"))}
            </ToastContainer>
            <ToastContainer position="bottom-end" className="me-3 mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == "bottom-end"))}
            </ToastContainer>
        </div>
    )
});
BootstrapToast.displayName = "BootstrapToast";
export default BootstrapToast;


class Singleton
{
    static instance: React.RefObject<RefCallbackCustom>
    protected constructor() { }

    public static showToast(toastOptions: ToastOptions)
    {
        this.instance.current?.show(toastOptions);
    }
}

export function BootstrapToastShow({
    title,
    message,
    duration = 3000,
    variant = "primary",
    toastPosition = "top-end"
}: ToastOptions)
{
    Singleton.showToast({
        title,
        message,
        duration,
        variant,
        toastPosition
    });
}

export function BoostrapToastSetRef(): React.RefObject<RefCallbackCustom>
{
    return Singleton.instance = useRef<RefCallbackCustom>(null);
}

class RefCallbackCustom
{
    private showEvent: (toastOptions: ToastOptions) => void

    constructor(callback: (toastOptions: ToastOptions) => void)
    {
        this.showEvent = callback;
    }

    show = (toastOptions: ToastOptions) => this.showEvent(toastOptions)
}

export interface ToastOptions
{
    title?: string
    message?: string | ReactElement<any, any>
    duration?: number
    variant?: string,
    toastPosition?: ToastPosition
}

export interface ToastItem extends ToastOptions
{
    id: string
}

