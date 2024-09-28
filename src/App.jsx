import Authentication from './routes/authentication'
import Chat from './routes/chat';

import { useState, useEffect } from 'react'
import { getToken } from './services/authenticationService'
import fetchService from './services/fetchService'
import { GlobalStateContext } from './context';
import { GrowingShrinkingSquare } from './custom/loading_animations';
import useCustomDialog from './custom/dialogs';

import { socket } from './socket';

export default function App() {

  const customDialogs = useCustomDialog()

  const [currentRoute, setCurrentRoute] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  // to load chat route only when required data is loaded
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

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

  // updates dark mode when changed internally
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? 'dark-theme' : 'light-theme');
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])


  // fetches current user
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setCurrentRoute('authentication')
      return
    }

    (async () => {
      try {
        const response = await fetchService(import.meta.env.VITE_SERVER_URL + '/getUser', { token })
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
          let message = 'Something went wrong'
          if (response.responseType == 'json') {
            message = response.responseData.message
          }
          else if (response.responseType == 'text') {
            message = response.responseData
          }
          await customDialogs({
            type: 'alert',
            description: message,
          })
        }
      }
      catch (error) {
        console.log("Error in getCurrentUser: ", error)
        await customDialogs({
          type: 'alert',
          description: 'Something went wrong!',
        })
      }
    })()

  }, [currentRoute])

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
        console.log('Temporary failure, the socket will be reconnected: ', error);
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
      {currentRoute == null &&
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <GrowingShrinkingSquare color='var(--selected-menu-tab-icon-color)' scale={5} />
        </div>
      }
      {currentRoute == 'authentication' && <Authentication setRoute={setCurrentRoute} />}
      <GlobalStateContext.Provider value={{ currentUser, setCurrentUser, darkMode, setDarkMode }}>
        {currentRoute == 'chat' && isDataLoaded && <Chat />}
      </GlobalStateContext.Provider>
    </>
  )

}