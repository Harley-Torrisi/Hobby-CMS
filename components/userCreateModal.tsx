// import { Queries } from "@lib/api/queries";
// import { UserGetDTO } from "@lib/database/interface/databaseDTOs";
// import { forwardRef, RefObject, useImperativeHandle } from "react";
// import { useRef, useState } from "react";
// import { Button, FormCheck, Modal } from "react-bootstrap";
// import { BootstrapToastShow } from "./boostrapToast";
// import { InputElement } from "./elementInput";
export { }
// export namespace UserCreateModal
// {
//     type OnCreatedEvent = (newUser: UserGetDTO) => Promise<void>;
//     type OnCacelEvent = () => void;

//     interface EventProps
//     {
//         onAccept: OnCreatedEvent,
//         onCancel?: OnCacelEvent,
//     }

//     class RefCallback
//     {
//         private showEvent: ({ onAccept, onCancel }: EventProps) => void

//         constructor(callback: ({ onAccept, onCancel }: EventProps) => void)
//         {
//             this.showEvent = callback;
//         }

//         Show = ({ onAccept, onCancel }: EventProps) => this.showEvent({ onAccept, onCancel });
//     }

//     export function GetRef(): RefObject<RefCallback>
//     {
//         return useRef<RefCallback>(null);
//     }

//     interface NewUserData
//     {
//         userName?: string,
//         userDisplayName?: string,
//         isAdmin?: boolean
//     }

//     export const Element = forwardRef<RefCallback>((_, ref) =>
//     {
//         const [showModal, setShowModal] = useState<boolean>(false);
//         const [eventProps, setEventProps] = useState<EventProps | null>();
//         const [actionWaiting, setActionWaiting] = useState(false);

//         const [newUser, setNewUser] = useState<NewUserData>({});

//         useImperativeHandle(ref, () => new RefCallback(OnShow));

//         async function OnShow(eventProps: EventProps)
//         {
//             setNewUser({ isAdmin: false });
//             setEventProps(eventProps);
//             setShowModal(true);
//         }

//         function onCancelHandler()
//         {
//             setNewUser({});
//             setShowModal(false);
//             setEventProps(null);
//             eventProps?.onCancel && eventProps.onCancel();
//         }

//         async function onAcceptHandler()
//         {
//             if (!newUser.userName)
//             {
//                 BootstrapToastShow({
//                     title: 'Warning',
//                     message: 'Username required.',
//                     variant: "warning",
//                     toastPosition: "top-center",
//                 });
//                 return;
//             }
//             const query: Queries = new Queries();
//             const resposne = await query.createUser({
//                 displayName: newUser.userDisplayName ?? '',
//                 userName: newUser.userName,
//                 userPasswordToken: '',
//                 isAdmin: false
//             })
//             // const resposne = await query.us({ projectID: editingProject.projectID, projectName: editingProject.projectName, accessToken: editingProject.accessToken, isActive: editingProject.isActive });

//             // if (!inputValue && eventProps?.acceptEmptyResponse == false)
//             // {
//             //     BootstrapToastShow({
//             //         title: 'Warning',
//             //         message: 'Input Required to Accept.',
//             //         variant: "warning",
//             //         toastPosition: "top-center",
//             //     });
//             //     return;
//             // }
//             ////setNewUser({});

//             // setActionWaiting(true);
//             // eventProps?.onAccept && await eventProps.onAccept(inputValue);
//             // setShowModal(false);
//             // setEventProps(null);
//             // setActionWaiting(false);
//         }

//         return (
//             <Modal centered show={showModal} backdrop="static" keyboard={false}>
//                 {eventProps && <>
//                     <Modal.Header>Create New User</Modal.Header>
//                     <Modal.Body className='flex-v gap-3'>
//                         <InputElement.Large
//                             placeholder="User Name"
//                             value={newUser.userName}
//                             onChangeValue={(value) => setNewUser({ ...newUser, userName: value })}
//                         />
//                         <InputElement.Large
//                             placeholder="Display Name"
//                             value={newUser.userDisplayName}
//                             onChangeValue={(value) => setNewUser({ ...newUser, userDisplayName: value })}
//                             subText="Optional: Supllied on 'Get Post' returns for flavour purposes."
//                         />
//                         <div>
//                             <FormCheck
//                                 label="Is Admin" type="switch" id='newUserIsAdminSwitch'
//                                 checked={newUser.isAdmin}
//                                 disabled={actionWaiting}
//                                 onChange={(event) => setNewUser({ ...newUser, isAdmin: event.target.checked })}
//                             />
//                         </div>
//                     </Modal.Body>
//                     <Modal.Footer className='flex flex-between'>
//                         <Button variant="secondary" onClick={onCancelHandler} size="sm" disabled={actionWaiting}>
//                             Close
//                         </Button>

//                         <Button variant="success" onClick={onAcceptHandler} size="sm" disabled={actionWaiting}>
//                             Accept
//                         </Button>
//                     </Modal.Footer>
//                 </>}


//             </Modal>
//         )
//     });

//     Element.displayName = "PopupInput";
// }