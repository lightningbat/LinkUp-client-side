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