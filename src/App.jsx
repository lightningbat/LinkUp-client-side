import Authentication from './routes/authentication'
import Chat from './routes/chat';

import { useState, useEffect } from 'react'
import { getToken } from './services/authenticationService'
import React from 'react'
export default function App() {

  const [currentRoute, setCurrentRoute] = useState('chat')

  useEffect(() => {
    const token = getToken()
    /*
    verify token here and set currentRoute accordingly
    */
  }, [])

  return (
    <>
      {currentRoute == 'authentication' && <Authentication setRoute={setCurrentRoute} />}
      {currentRoute == 'chat' && <Chat />}
    </>
  )

}