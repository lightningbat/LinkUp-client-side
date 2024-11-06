import './App.css'

import Authentication from './routes/authentication'
import Chat from './routes/chat';

import { useState, useEffect } from 'react'
import { getToken } from './services/authenticationService'
import fetchService from './services/fetchService'
import { GlobalStateContext } from './context';
import { GrowingShrinkingSquare } from './custom/loading_animations';
import useCustomDialog from './custom/dialogs';
import { useImmer } from 'use-immer';
import { socket } from './socket';

export default function App() {

  const customDialogs = useCustomDialog()

  const [currentRoute, setCurrentRoute] = useState(null) // 'authentication' or 'chat'
  const [currentUser, setCurrentUser] = useState(null)
  const [contactsList, setContactsList] = useState(null)
  const [contactsChatData, updateContactsChatData] = useImmer({})
  const [isDataLoaded, setIsDataLoaded] = useState(false) // to load chat route only when required data is loaded
  const [darkMode, setDarkMode] = useState(false)

  // error state for fetching user
  const [errorFetchingUser, setErrorFetchingUser] = useState(false)

  // sets dark mode from local storage
  useEffect(() => {
    const dark_mode = localStorage.getItem('darkMode')
    if (dark_mode == null) {
      localStorage.setItem('darkMode', 'false')
    }
    else if (dark_mode == 'true') {
      setDarkMode(true)
    }
  }, [])

  // updates dark mode when changed by user
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? 'dark-theme' : 'light-theme');
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])


  // fetches current user info
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setCurrentRoute('authentication')
      return
    }

    (async () => {
      try {
        const response = await fetchService('getUser', { token })
        if (response.ok) {
          setCurrentUser(response.responseData)
          setCurrentRoute('chat')
          setIsDataLoaded(true)
        }
        else if (response.status == 400) {
          setCurrentRoute('authentication')
        }
        else {
          console.log(response)
          setErrorFetchingUser(true)
          let message = 'Something went wrong'
          if (response.responseType == 'json') {
            message = response.responseData.message
          }
          else if (response.responseType == 'text') {
            message = response.responseData
          }
          await customDialogs({
            type: 'alert',
            description: `${message}\n\nTry refreshing the page`,
          })
        }
      }
      catch (error) {
        setErrorFetchingUser(true)
        console.log("Error in getCurrentUser: ", error)
        await customDialogs({
          type: 'alert',
          description: 'Something went wrong!\n\nTry refreshing the page',
        })
      }
    })()

  }, [currentRoute])

  // socket connection
  useEffect(() => {
    function onConnect() {
      console.log('Connected to the socket server');
    }

    function onDisconnect() {
      if (socket.active) {
        console.log('Temporarily disconnected, the socket will be reconnected');
      } else {
        console.log('Disconnected from the socket server');
      }
    }

    function onConnectError(error) {
      if (socket.active) {
        console.log('Temporary failure, the socket will be reconnected: ');
        console.log("message: ", error.message);
        console.log("description: ", error.description);
        console.log("context: ", error.context);
      } else {
        console.log('Error connecting to the socket server: ', error);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  return (
    <>
      {currentRoute == null && !errorFetchingUser &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <GrowingShrinkingSquare color='var(--selected-menu-tab-icon-color)' scale={5} />
        </div>
      }

      {currentRoute == 'authentication' && <Authentication setRoute={setCurrentRoute} />}

      <GlobalStateContext.Provider
        value={{
          currentUser, setCurrentUser,
          contactsList, setContactsList,
          contactsChatData, updateContactsChatData,
          darkMode, setDarkMode
        }}>

        {currentRoute == 'chat' && isDataLoaded && <Chat />}

        <div className='floating-btns'>
          <button className='floating-button' onClick={() => { socket.disconnect() }}>Disconnect</button>
          <button className='floating-button' onClick={() => { socket.connect() }}>Connect</button>
        </div>
      </GlobalStateContext.Provider>
    </>
  )

}