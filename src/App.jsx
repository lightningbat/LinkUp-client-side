import Authentication from './routes/authentication'
import Chat from './routes/chat';

import { useState, useEffect } from 'react'
import { getToken } from './services/authenticationService'
import fetchService from './services/fetchService'
import { GlobalStateContext } from './context';

export default function App() {

  const [currentRoute, setCurrentRoute] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // set theme
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? 'dark-theme' : 'light-theme');
  }, [darkMode])


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
        }
        else {
          setCurrentRoute('authentication')
        }
      }
      catch (error) {
        setCurrentRoute('authentication')
        console.log("Error in getCurrentUser: ", error)
      }
    })()

  }, [currentRoute])

  return (
    <>
      {currentRoute == 'authentication' && <Authentication setRoute={setCurrentRoute} />}
      <GlobalStateContext.Provider value={{ currentUser, setCurrentUser, darkMode, setDarkMode }}>
        {currentRoute == 'chat' && <Chat />}
      </GlobalStateContext.Provider>
    </>
  )

}