// import { DefaultResponses } from "@lib/api/defaultResponses";
// import { Queries } from "@lib/api/queries";
// import { NextPageCustom } from "@lib/extentions/appPropsCustom";
// import { GetServerSideProps } from "next";
// import { DatabaseDTOs as DTOs } from '@lib/database/interface/databaseDTOs';
// import { useState } from "react";
// import { LayoutHead } from "@components/layoutHead";
// import { LayoutMain } from "@components/layoutMain";
export { }
// export const getServerSideProps: GetServerSideProps = async (context) =>
// {
//     const query: Queries = new Queries();
//     const response = await query.getUsers();

//     if (response.succeeded)
//     {
//         return {
//             props: {
//                 users: response.data
//             } as Props
//         }
//     }

//     return DefaultResponses.redirect('/');
// }

// interface Props
// {
//     users: DTOs.UserGet[];
// }

// const Users: NextPageCustom<Props> = (props) =>
// {
//     const [users, setUsers] = useState<DTOs.UserGet[]>(props.users);

//     return (<>
//         <LayoutHead title='Projects' />
//         <LayoutMain>
//             <h1>User Accounts</h1>
//             <hr />
//             {/* User List */}
//             <table className='table table-hover table-striped table-bordered'>
//                 <thead>
//                     <tr>
//                         <th>
//                             <div className='flex'>
//                                 <span className='flex-grow'>
//                                     Project Name
//                                 </span>
//                                 {/* <span role="button" className='text-secondary' onClick={newPorjectHandler}>[Add]</span> */}
//                             </div>
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.length > 0 && users.map((x, i) =>
//                         <tr key={i}>
//                             <td className='ev-hover'>
//                                 <div className='flex'>
//                                     <span className="flex-grow">
//                                         {!x.isActive && <span title='User Inactive' className='text-warning me-2 bi bi-exclamation-triangle-fill'></span>}
//                                         {x.displayName}
//                                     </span>
//                                     <div className='ev-trigger-nth-d-flex gap-2'>
//                                         {/* <span role="button" className='text-primary' onClick={() => editProjectOpenHandler(x)}>[Show]</span>
//                                             <span role="button" className='text-danger' onClick={() => deleteProjectHandler(x.projectID)}>[Delete]</span> */}
//                                     </div>
//                                 </div>
//                             </td>
//                         </tr>
//                     ) || <tr><td className='p-1 pt-2 text-center'>...No Users...</td></tr>}
//                 </tbody>
//             </table>
//         </LayoutMain>
//     </>)
// };

// Users.displayName = "Users";
// export default Users;

