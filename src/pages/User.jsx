import React, { useState } from 'react';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page } from '@syncfusion/ej2-react-grids';

import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { useGetUsersQuery, useUpdateUserMutation } from '../services/userService';
import { MdOutlineCancel } from 'react-icons/md';
import { Space, Button, message } from 'antd';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'

const Users = () => {
  const { data } = useGetUsersQuery();
  const currentUser = useSelector(selectCurrentUser)
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
  const [actionProp, setActionProp] = useState();
  const [selectedRole, setSelectedRole] = useState('');
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const actionTemplate = (props) => (
    <div className="items-center">
      {props.id !== currentUser.id && <button
        onClick={() => {
          setActionProp(props)
          setSelectedRole(props.role)
        }}
        type="button"
        style={{ backgroundColor: props.is_approved ? 'orange' : 'green' }}
        className="text-sm opacity-0.9  w-16 text-white  hover:drop-shadow-xl rounded-xl p-2"
      >  {props.is_approved ? 'Block' : 'Approve'} </button>}
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
      template: actionTemplate,
      headerText: 'Action',
      width: '125',
      textAlign: 'Center'
    },
  ];
  const [updateUser] = useUpdateUserMutation()
  const handleOk = async () => {
    try {
      const result = await updateUser({ id: actionProp?.id, data: { is_approved: !actionProp?.is_approved, role: selectedRole } });
      console.log(result, 'vvvvvvvvv');
      if (result?.error) {
        message.error(result.error.data.error)
      } else {
        message.success(result.data.message)
      }
      setActionProp(null)
    } catch (e) {
      message.error(JSON.stringify(e));
    }
  }
  return (
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <Header category="Page" title="Users" />
      {actionProp != null && (
        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold text-center">{!actionProp?.is_approved ? 'APPROVE' : 'BLOCK'}</h3>
                <button
                  style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                  className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  onClick={() => setActionProp(null)}
                >
                  <MdOutlineCancel />
                </button>
              </div>

              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">

                  {
                    actionProp?.is_approved ? <h3 className='mb-4'>{`Are you sure you want to BLOCK  "${actionProp?.firstname} ${actionProp?.lastname}"`}</h3> :
                      <div className='mb-4'>
                        <label htmlFor="role">{`Select Role to approve "${actionProp?.firstname} ${actionProp?.lastname}" for`}</label>
                        <br />
                        <select id="role" value={selectedRole} onChange={handleRoleChange}
                          className='mr-2 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'>
                          <option value="creator">Creator</option>
                          <option value="verifier">Verifier</option>
                          <option value="approver">Approver</option>
                          <option value="header">Header</option>
                          <option value="viewer">Viewer</option>
                          <option value="minister">Minister</option>
                          <option value="admin">Admin</option>
                        </select>
                        {selectedRole && <p>Selected role: {selectedRole}</p>}
                      </div>
                  }

                  <Space align="center" block="true">
                    <Button type="primary" danger htmlType="button" onClick={() => handleOk()}>
                      Yes
                    </Button>
                    <Button htmlType="button" onClick={() => setActionProp(null)}>
                      Cancel
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
