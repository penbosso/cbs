import React, { useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header, DistrictModal } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { MdOutlineCategory, MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { AiFillEdit, AiTwotoneDelete } from 'react-icons/ai';
import { useGetDistrictsQuery } from '../services/districtService';
import { Space, Button, message } from 'antd';

const District = () => {
  const toolbarOptions = ['Search'];
  const { currentColor, handleClickWithCatId, handleClick, isClicked } = useStateContext();
  const { data} = useGetDistrictsQuery();
  const districts = data?.locations
  const deleteDistrict = ()=>{};
  const [deleteCat, setDeleteCat] = useState(null);

  const EditDistrictTemp = (props) => {
    return (
      <Space size="middle">
        <TooltipComponent
          content="Edit"
        >
          <button type='button' className="text-xl" onClick={() => handleClickWithCatId(props.id)}> <AiFillEdit /> </button>
        </TooltipComponent>

        <TooltipComponent
          content="Delete"
        >
          <button type='button' className="text-xl" onClick={() => setDeleteCat(props)}> <AiTwotoneDelete color='red' /> </button>
        </TooltipComponent>
      </Space>
    )
  };

  const districtGrid = [
    { field: 'name', headerText: 'District', width: '150', textAlign: 'Center' },
    { headerText: 'Action', width: '100', textAlign: 'Center', template: EditDistrictTemp }
  ];

  const handleDelete = async () => {
    const result = await deleteDistrict(deleteCat.id)
    if (result.data == 'ok'){
      message.success("District deleted")
      setDeleteCat(null)
    }
    else
      message.success("District not deleted")
  }

  return (
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <div className="flex justify-between items-center">
        <Header district="Page" title="Districts" />
        <button
          onClick={() => { handleClick('districtModal') }}
          type="button"
          style={{ backgroundColor: currentColor }}
          className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
        > <MdOutlineCategory /> <span className="ml-1"> Add New </span></button>
      </div>

      {isClicked.districtModal && (<DistrictModal districtId={isClicked.districtId} />)}
      {deleteCat && (
        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                <h3 className="text-3xl font=semibold">Delete '{deleteCat.name}' District</h3>
                <button
                  style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                  className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                  onClick={() => setDeleteCat(null)}
                >
                  <MdOutlineCancel />
                </button>
              </div>

              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">

                  <h3>Are you sure you want to delete {deleteCat.name}</h3>
                  <Space align="center" block="true">
                    <Button type="primary" danger htmlType="button" onClick={handleDelete}>
                      Delete
                    </Button>
                    <Button htmlType="button" onClick={() => setDeleteCat(null)}>
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
        dataSource={districts}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        toolbar={toolbarOptions}
        allowSorting
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {districtGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default District;
