// import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { auth } from '../firebase/config';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
  categoryModal: false,
  marketModal: false,
  ComponentModal: false,
  marketRecordModal: false,
  categoryId: null,
  menuItemId: null,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#1A97F5');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [editMarketRecord, setEditMarketRecord] = useState(false);
  const [authUser, setAuthUser] = useState();
  const [editMarket, setEditMarket] = useState();
  const [marketRecord, setMarketRecord] = useState({ market: '', season: '', year: '',records: [] });

  useEffect(() => {
    const unsubscribe = () =>{}
    return () => { unsubscribe(); };
  }, []);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });
  const handleClickWithCatId = (categoryId) => setIsClicked({ ...initialState, districtModal: true, categoryId })
  const handleClickWithItemId = (menuItemId) => setIsClicked({ ...initialState, menuItemModal: true, menuItemId })

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{
      editMarketRecord, setEditMarketRecord, authUser, currentColor, currentMode, activeMenu, screenSize,
      setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, 
      setCurrentColor, setCurrentMode, handleClickWithCatId, handleClickWithItemId, editMarket, setEditMarket,
      setMode, setColor, themeSettings, setThemeSettings, marketRecord, setMarketRecord
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
