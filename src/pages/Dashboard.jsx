import React from 'react';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { dropdownData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'
import { DashboardView } from '../components';
import { useNavigate } from 'react-router-dom';


const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  // if(['verifier', 'minister', 'viewer', 'admin'].includes(currentUser.role))
  //   navigate('/market-record')

  return (

    <div className="mt-2">
      <DashboardView />
    </div>
  );
};

export default Dashboard;
