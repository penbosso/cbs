import React from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { dropdownData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Dashboard = () => {
  const { currentColor, currentMode } = useStateContext();

  return (

    <div className="mt-2">
    </div>
  );
};

export default Dashboard;
