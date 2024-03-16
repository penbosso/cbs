import React, { useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Group, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Header, DropdownButton, MarketRecordModal } from '../components';
import { useGetOrderByRestaurantIdQuery, useGetUserMarketRecordsQuery } from '../services/marketRecordService';
import { useStateContext } from '../contexts/ContextProvider'
import { AiFillEdit, AiTwotoneDelete, AiOutlineFolderView } from 'react-icons/ai';
import { Space, Button, message } from 'antd';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { MdAddShoppingCart } from 'react-icons/md';
import { VscServerProcess } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'
import { formatDate } from '../util/helper';

const MarketRecord = () => {
  const { currentColor, handleClickWithCatId, handleClick, isClicked, setMarketRecord, marketRecord } = useStateContext();
  const currentUser = useSelector(selectCurrentUser)

  const [proccessed, setProcessed] = useState(false);
  const navigate = useNavigate()
  const occupanyRateTemp = (props) => {
    return <span>1</span>
  }
  const gridMarketRecordtatus = (props) => (
    <button
      type="button"
      style={{ background: 'black' }}
      className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
      {props?.status}
    </button>
  );
  const dateTemplate = (props) => (
    <span>{formatDate(props.created_at)}</span>
  );

  const ActionTempplate = (props) => {
    return (
      <Space size="middle">
        <TooltipComponent
          content="View"
        >
          <button type='button' className="text-xl" onClick={() => {
            setMarketRecord(props);
            navigate('/market-record-detail')
          }}> <AiOutlineFolderView /> </button>
        </TooltipComponent>

        {/* <TooltipComponent
          content="Delete"
        >
          <button type='button' className="text-xl" onClick={() => { }}> <AiTwotoneDelete color='red' /> </button>
        </TooltipComponent> */}
      </Space>
    )
  };

  const groupOptions = { showGroupedColumn: false, columns: ['group_id'], showDropArea: false, showToggleButton: false };

  const toolbarOptions = ['Search'];
  const marketrecordGrid = [
    {
      field: 'season',
      headerText: 'Season',
      width: '150',
      textAlign: 'Center',
    },
    {
      field: 'market',
      headerText: 'Market',
      width: '150',
      textAlign: 'Center',
    },
    {
      headerText: 'Status',
      field: 'status',
      textAlign: 'Center',
      width: '120',
    },
    {
      headerText: 'Created at',
      width: '150',
      textAlign: 'Center',
      template: dateTemplate
    },
    {
      headerText: 'Action',
      width: '150',
      textAlign: 'Center',
      template: ActionTempplate
    },
  ];

  const { data } = useGetUserMarketRecordsQuery(currentUser);
  console.log(data);
  const marketrecord = data?.reports
  const editing = { allowDeleting: true, allowEditing: true };
  const contextMenuItems = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Search',
    'Save',
    'Cancel',
    'PdfExport',
    'ExcelExport',
    'CsvExport',
    'FirstPage',
    'PrevPage',
    'LastPage',
    'NextPage',
  ];

  return (
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <div className='flex justify-between items-center' >
        <Header category="Page" title="Market Record" />
        <div className='flex'>
          <button
            onClick={() => { setProcessed(!proccessed) }}
            type="button"
            style={{ backgroundColor: proccessed ? 'orange' : 'green' }}
            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
          > <VscServerProcess /> <span className=""> {proccessed ? 'To be processed' : 'All reports'} </span></button>
          <button
            onClick={() => { navigate('/market-record-detail') }}
            type="button"
            style={{ backgroundColor: currentColor }}
            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
          > <MdAddShoppingCart /> <span className="ml-1"> Add New </span></button>
        </div>
      </div>
      
      <GridComponent
        id="gridcomp"
        dataSource={marketrecord}
        allowPaging
        pageSettings={{ pageSize: 10 }}
        toolbar={toolbarOptions}
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {marketrecordGrid.map((item, index) => <ColumnDirective key={index} {...item} />)}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, Group, PdfExport]} />
      </GridComponent>
    </div>
  );
};
export default MarketRecord;
