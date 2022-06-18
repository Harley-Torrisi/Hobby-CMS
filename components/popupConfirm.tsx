import { useImperativeHandle, useState, RefObject, forwardRef, useRef } from "react";
import { Button, Modal } from "react-bootstrap";

export namespace PopupConfirm
{
    export enum ResponseTypes
    {
        Yes = 1,
        No = 2
    }

    type ResponseEvent = (value: ResponseTypes) => Promise<void>;

    interface EventProps
    {
        header: string,
        message?: string,
        responseCallback: ResponseEvent
    }

    export class RefCallback
    {
        private showEvent: ({ header, message, responseCallback }: EventProps) => void

        constructor(callback: ({ header, message, responseCallback }: EventProps) => void)
        {
            this.showEvent = callback;
        }

        Show = ({ header, message, responseCallback }: EventProps) => this.showEvent({ header, message, responseCallback });
    }

    export function GetRef(): RefObject<RefCallback>
    {
        return useRef<RefCallback>(null);
    }

    export const Element = forwardRef<RefCallback>((_, ref) =>
    {
        const [showModal, setShowModal] = useState<boolean>(false);
        const [eventProps, setEventProps] = useState<EventProps | null>(null);
        const [actionWaiting, setActionWaiting] = useState(false);

        useImperativeHandle(ref, () => new RefCallback(OnShow));

        async function OnShow(event: EventProps)
        {
            setEventProps(event);
            setShowModal(true);
        }

        async function OnRespondHandler(response: ResponseTypes)
        {
            setActionWaiting(true);
            eventProps?.responseCallback && await eventProps.responseCallback(response);
            setShowModal(false);
            setActionWaiting(false);
        }

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" keyboard={false}>
                {eventProps && <>
                    <Modal.Body className="flex-v flex-align-center">
                        {eventProps.header && <h5 style={{ textAlign: 'center' }}>{eventProps.header}</h5>}
                        {eventProps.message && <span style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{eventProps.message}</span>}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex w-100 gap-2">
                            <Button variant="danger" className="flex-grow" onClick={() => OnRespondHandler(ResponseTypes.No)} disabled={actionWaiting}>No</Button>
                            <Button variant="success" className="flex-grow" onClick={() => OnRespondHandler(ResponseTypes.Yes)} disabled={actionWaiting}>Yes</Button>
                        </div>
                    </Modal.Footer>
                </>}
            </Modal>
        )
    });

    Element.displayName = "ConfimationModal";
}