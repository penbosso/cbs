import React from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';

import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { useGetUsersQuery } from '../services/userService';

const Users = () => {
  const { data } = useGetUsersQuery();
  const users = data?.users
console.log(users)
  const toolbarOptions = ['Search'];
  const tempUserRole = (props) => (
    <div className="flex items-center gap-2">
      <p>{props.role == 10 ? 'Administrator' : 'Manager'}</p>
    </div>
  );
  const tempTimestamp = (props) => (
    <div className="">
      <p>{(props.timestamp.toDate()).toDateString()}</p>
    </div>
  );
  const usersGrid = [
    {
      headerText: 'First name',
      width: '100',
      field: 'firstname',
      textAlign: 'Center'
    },
    {
      field: 'lastname',
      headerText: 'Last name',
      width: '100',
      textAlign: 'Center',
    },
    {
      headerText: 'Email',
      width: '120',
      textAlign: 'Center',
      field: 'email'
    },
    {
      headerText: 'Phone',
      width: '120',
      textAlign: 'Center',
      field: 'phone_number'
    },
    {
      headerText: 'District',
      width: '90',
      textAlign: 'Center',
      field: 'location'
    },
    {
      headerText: 'Role',
      width: '90',
      textAlign: 'Center',
      field: 'role'
    },
    {
      headerText: 'Approved',
      width: '80',
      textAlign: 'Center',
      field: 'is_approved'
    },

    // {
    //   headerText: 'Date onboard',
    //   field:  'updated_at',
    //   width: '135',
    //   format: 'yMd',
    //   textAlign: 'Center'
    // },

    {
      field: '',
      headerText: 'Action',
      width: '125',
      textAlign: 'Center'
    },
  ];

  return (
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <Header category="Page" title="Users" />
      <GridComponent
        dataSource={users}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 8 }}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {usersGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Search, Page]} />

      </GridComponent>
    </div>
  );
};
export default Users;
