import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState(localStorage.getItem('colorMode') || '#03C9D7');
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('themeMode') || 'Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  // Save theme mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('themeMode', currentMode);
  }, [currentMode]);

  // Save color mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('colorMode', currentColor);
  }, [currentColor]);

  const setMode = (mode) => setCurrentMode(mode);
  const setColor = (color) => setCurrentColor(color);
  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  // Optimize Context value using useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentColor,
      currentMode,
      activeMenu,
      screenSize,
      setScreenSize,
      handleClick,
      isClicked,
      setIsClicked,
      setActiveMenu,
      setCurrentColor,
      setCurrentMode,
      setMode,
      setColor,
      themeSettings,
      setThemeSettings,
    }),
    [currentColor, currentMode, activeMenu, screenSize, isClicked, themeSettings]
  );

  return <StateContext.Provider value={contextValue}>{children}</StateContext.Provider>;
};

export const useStateContext = () => useContext(StateContext);
