import React, { useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header, ComponentModal } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { MdOutlineCategory, MdOutlineCancel } from 'react-icons/md';
import { AiFillEdit, AiTwotoneDelete } from 'react-icons/ai';
import { Space, Button, message } from 'antd';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useGetComponentsQuery } from '../services/componentService';

const Component = () => {
  const toolbarOptions = ['Search'];
  const { currentColor, handleClickWithCatId, handleClick, isClicked } = useStateContext();
  const { data } = useGetComponentsQuery();

  const components = data?.components
  const deleteComponent = () => { };
  const [deleteMart, setDeleteMart] = useState(null);
  const [editMart, setEditMart] = useState('')

  const EditComponentTemp = (props) => {
    return (
      <Space size="middle">
        <TooltipComponent
          content="Edit"
        >
          <button type='button' className="text-xl" onClick={() => {
            handleClick('componentModal')
            setEditMart(props)
          }}> <AiFillEdit /> </button>
        </TooltipComponent>

        {/* <TooltipComponent
          content="Delete"
        >
          <button type='button' className="text-xl" onClick={() => setDeleteMart(props)}> <AiTwotoneDelete color='red' /> </button>
        </TooltipComponent> */}
      </Space>
    )
  };

  const componentGrid = [
    { field: 'name', headerText: 'Component', width: '150', textAlign: 'Center' },
    { field: 'market', headerText: 'Market', width: '150', textAlign: 'Center' },
    { field: 'total_number_places_available', headerText: 'Available places', width: '150', textAlign: 'Center' },
    { headerText: 'Action', width: '100', textAlign: 'Center', template: EditComponentTemp }
  ];

  const handleDelete = async () => {
    const result = await deleteComponent(deleteMart.id)
    if (result?.data == 'ok') {
      message.success("Component deleted")
      setDeleteMart(null)
    }
    else
      message.success("Component not deleted")
    setDeleteMart(null)
  }

  return (
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <div className="flex justify-between items-center">
        <Header component="Page" title="Components" />
        <button
          onClick={() => { handleClick('componentModal') }}
          type="button"
          style={{ backgroundColor: currentColor }}
          className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
        > <MdOutlineCategory /> <span className="ml-1"> Add New </span></button>
      </div>

      {isClicked.componentModal && (<ComponentModal component={editMart} />)}
      {deleteMart && (
        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">Delete '{deleteMart.name}' Component</h3>
                <button
                  style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                  className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  onClick={() => setDeleteMart(null)}
                >
                  <MdOutlineCancel />
                </button>
              </div>

              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">

                  <h3>Are you sure you want to delete {deleteMart.name}</h3>
                  <Space align="center" block="true">
                    <Button type="primary" danger htmlType="button" onClick={handleDelete}>
                      Delete
                    </Button>
                    <Button htmlType="button" onClick={() => setDeleteMart(null)}>
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
        dataSource={components}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        toolbar={toolbarOptions}
        allowSorting
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {componentGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Component;
