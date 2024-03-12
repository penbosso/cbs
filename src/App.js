import React, {  } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
// import { useGetUserByUserIdQuery } from './services/userService';
import { Navbar, Sidebar } from './components';
import { Dashboard, AdminDashboard, MarketRecord, Users, District, Market, Missing } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { currentMode, activeMenu } = useStateContext();

    return (
      <div className={currentMode === 'Dark' ? 'dark' : ''}>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" >
            <TooltipComponent
              content="Settings"
              position="Top"
            >

            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white " style={{ zIndex: '900' }}>
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>

              <Routes>

                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={(<Dashboard />)} />
                <Route path="/admin-dashboard" element={(<AdminDashboard />)} />
                <Route path="/user" element={<Users />} />
                <Route path="/market" element={<Market />} />
                <Route path="/district" element={<District />} />
                <Route path="/market-record" element={<MarketRecord />} />
                <Route path="*" element={<Missing />} />

              </Routes>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
      </div>
    );
};

export default App;
