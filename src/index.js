import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ContextProvider } from './contexts/ContextProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signin, Signup, ForgotPassword } from './pages';
import { Provider } from 'react-redux'
import { useStateContext } from './contexts/ContextProvider';
import { store } from './store'
import { ProtectedRoute } from './components';

const TopRoute = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext();


  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);


  return (
    <BrowserRouter>
      <div className={currentMode === 'Dark' ? 'dark' : ''}>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<ProtectedRoute> <App /> </ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <ContextProvider>
        <TopRoute />
      </ContextProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
