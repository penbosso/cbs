import React, { useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Group, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Header, DropdownButton, MarketRecordModal } from '../components';
import { useGetOrderByRestaurantIdQuery } from '../services/marketRecordService';
import { useStateContext } from '../contexts/ContextProvider';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { MdAddShoppingCart } from 'react-icons/md';
import { VscServerProcess } from "react-icons/vsc";

const MarketRecord = () => {
  const { currentColor, handleClickWithCatId, handleClick, isClicked } = useStateContext();
  const [proccessed, setProcessed] = useState(false);
  const marketRecordtatusAction = (props) => (
    <DropdownButton order={props} />
  );
  const occupanyRateTemp = (props) => {
    return <span>1</span>
  }
  const gridMarketRecordtatus = (props) => (
    <button
      type="button"
      style={{ background: 'black' }}
      className="text-white py-1 px-2 capitalize rounded-2xl text-md"
    >
      {props.status}
    </button>
  );
  const gridOrderImage = (props) => (
    <div>
      <img
        className="rounded-xl h-10 md:ml-3"
        src={props.image}
        alt="order-item"
      />
    </div>
  );

  const groupOptions = { showGroupedColumn: false, columns: ['group_id'], showDropArea: false, showToggleButton: false };

  const marketrecordGrid = [
    {
      field: 'season',
      headerText: 'Season',
      textAlign: 'Center',
      width: '100',
    },
    {
      field: 'item_name',
      headerText: 'Component',
      width: '150',
      textAlign: 'Center',
    },
    {
      field: 'location',
      headerText: 'District',
      width: '100',
      textAlign: 'Center',
    },
    {
      headerText: 'Status',
      template: gridMarketRecordtatus,
      field: 'OrderItems',
      textAlign: 'Center',
      width: '120',
    },
    {
      field: 'total_number_of_places_available',
      headerText: '# Places_available',
      width: '100',
      textAlign: 'Center',
    },
    {
      field: 'number_of_places_rented',
      headerText: '# Places rented',
      width: '120',
      textAlign: 'Center',
    },
    {
      field: 'createdAt',
      headerText: 'Created on',
      width: '120',
      textAlign: 'Center',
    },
    {
      headerText: 'Occupancy rate',
      width: '120',
      textAlign: 'Center',
      template: occupanyRateTemp
    },
    {
      headerText: 'Observation',
      width: '120',
      textAlign: 'Center',
      field: 'observation'
    },
    {
      headerText: 'Action',
      width: '150',
      textAlign: 'Center',
      template: marketRecordtatusAction
    },
  ];

  const { myRestaurant } = useStateContext();
  const { data: marketrecord } = {};
  const editing = { allowDeleting: true, allowEditing: true };
  const contextMenuItems = [
    'AutoFit',
    'AutoFitAll',
    'SortAscending',
    'SortDescending',
    'Copy',
    'Edit',
    'Delete',
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
            style={{ backgroundColor: proccessed? 'orange' : 'green' }}
            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
          > <VscServerProcess /> <span className=""> {proccessed? 'To be processed' : 'Processed'} </span></button>
          <button
            onClick={() => { handleClick('marketModal') }}
            type="button"
            style={{ backgroundColor: currentColor }}
            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
          > <MdAddShoppingCart /> <span className="ml-1"> Add New </span></button>
        </div>
      </div>
      {isClicked.marketModal && (<MarketRecordModal districtId={isClicked.districtId} />)}
      <GridComponent
        id="gridcomp"
        dataSource={marketrecord}
        allowPaging
        pageSettings={{ pageSize: 8 }}
        // allowGrouping={true} 
        // groupSettings={groupOptions}
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
