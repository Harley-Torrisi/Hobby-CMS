import { BootstrapHelper } from "@lib/bootsrapHelper"
import React, { useImperativeHandle } from "react";
import { ReactElement, useRef, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { ToastPosition } from "react-bootstrap/esm/ToastContainer";

export namespace ToastPopupElement
{
    export class RefCallback
    {
        showEvent: (toastOptions: ToastOptions) => void

        constructor(callback: (toastOptions: ToastOptions) => void)
        {
            this.showEvent = callback;
        }

        show = ({
            title,
            message,
            duration = 3000,
            variant = BootstrapHelper.Variants.Primary,
            toastPosition = BootstrapHelper.Positions.TopEnd
        }: ToastOptions) => this.showEvent({
            title,
            message,
            duration,
            variant,
            toastPosition
        });
    }

    export function GetRef(): React.RefObject<RefCallback>
    {
        return useRef<RefCallback>(null);
    }

    export type Variant = BootstrapHelper.Variants;

    export interface ToastOptions
    {
        title?: string
        message?: string | ReactElement<any, any>
        duration?: number
        variant?: Variant,
        toastPosition?: ToastPosition
    }

    interface ToastItem extends ToastOptions
    {
        id: string
    }

    export const Popup = React.forwardRef<RefCallback>((_, ref) =>
    {
        const [toasts, setToasts] = useState<ToastItem[]>([]);

        useImperativeHandle(ref, () => new RefCallback(showHandler));

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

        return (<>
            <ToastContainer position={BootstrapHelper.Positions.TopStart} className="ms-3 mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.TopStart))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.TopCenter} className="mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.TopCenter))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.TopEnd} className="me-3 mt-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.TopEnd))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.MiddleStart} className="ms-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.MiddleStart))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.MiddleCenter}>
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.MiddleCenter))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.MiddleEnd} className="me-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.MiddleEnd))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.BottomStart} className="ms-3 mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.BottomStart))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.BottomCenter} className="mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.BottomCenter))}
            </ToastContainer>
            <ToastContainer position={BootstrapHelper.Positions.BottomEnd} className="me-3 mb-3">
                {DisplayToatsList(toasts.filter(x => x.toastPosition == BootstrapHelper.Positions.BottomEnd))}
            </ToastContainer>
        </>)
    });
    Popup.displayName = "Popup";
}