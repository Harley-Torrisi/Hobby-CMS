import React, { useImperativeHandle, useState } from "react";
import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { InputElement } from '@components/elementInput';
import { BootstrapToastShow } from '@components/boostrapToast';

export namespace PopuptInput
{
    type OnCacelEvent = () => void;
    type OnAcceptEvent = (value: string | undefined) => Promise<void>;

    interface EventProps
    {
        header: string,
        intialValue?: string,
        placeholder: string,
        onAccept: OnAcceptEvent,
        onCancel?: OnCacelEvent,
        acceptEmptyResponse?: boolean
    }

    class RefCallback
    {
        private showEvent: ({ header, intialValue, placeholder, onAccept, onCancel, acceptEmptyResponse: allowEmptyReturn }: EventProps) => void

        constructor(callback: ({ header, intialValue, placeholder, onAccept, onCancel, acceptEmptyResponse: allowEmptyReturn }: EventProps) => void)
        {
            this.showEvent = callback;
        }

        Show = ({ header, intialValue, placeholder, onAccept, onCancel, acceptEmptyResponse = true }: EventProps) => this.showEvent({ header, intialValue, placeholder, onAccept, onCancel, acceptEmptyResponse });
    }

    export function GetRef(): React.RefObject<RefCallback>
    {
        return useRef<RefCallback>(null);
    }

    export const Element = React.forwardRef<RefCallback>((_, ref) =>
    {
        const [showModal, setShowModal] = useState<boolean>(false);
        const [eventProps, setEventProps] = useState<EventProps | null>();
        const [inputValue, setInputValue] = useState<string | undefined>();
        const [actionWaiting, setActionWaiting] = useState(false);

        useImperativeHandle(ref, () => new RefCallback(OnShow));

        async function OnShow(eventProps: EventProps)
        {
            setEventProps(eventProps);
            setInputValue(eventProps.intialValue)
            setShowModal(true);
        }

        function onCancelHandler()
        {
            setShowModal(false);
            setEventProps(null);
            eventProps?.onCancel && eventProps.onCancel();
        }

        async function onAcceptHandler()
        {
            if (!inputValue && eventProps?.acceptEmptyResponse == false)
            {
                BootstrapToastShow({
                    title: 'Warning',
                    message: 'Input Required to Accept.',
                    variant: "warning",
                    toastPosition: "top-center",
                });
                return;
            }


            setActionWaiting(true);
            eventProps?.onAccept && await eventProps.onAccept(inputValue);
            setShowModal(false);
            setEventProps(null);
            setActionWaiting(false);
        }

        return (
            <Modal centered show={showModal} backdrop="static" keyboard={false}>
                {eventProps && <>
                    <Modal.Header>
                        {eventProps.header}
                    </Modal.Header>
                    <Modal.Body className='flex-v gap-3'>
                        <InputElement.Large
                            placeholder={eventProps.placeholder}
                            value={inputValue}
                            onChangeValue={(value) => setInputValue(value)}
                        />
                    </Modal.Body>
                    <Modal.Footer className='flex flex-between'>
                        <Button variant="secondary" onClick={onCancelHandler} size="sm" disabled={actionWaiting}>
                            Close
                        </Button>

                        <Button variant="success" onClick={onAcceptHandler} size="sm" disabled={actionWaiting}>
                            Accept
                        </Button>
                    </Modal.Footer>
                </>}


            </Modal>
        )
    });

    Element.displayName = "PopupInput";
}


