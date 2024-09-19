import './style.scss';

import { Menu, ContactsTab, GroupsTab, SettingsTab } from './layout'

import React, { useEffect, useState, useRef } from 'react';
// import io from "socket.io-client";

export default function Chat() {

    // const socket = io("localhost:3000");

    // socket.on("connect", () => {
    //     console.log(`Connected to server: ${socket.id}`);
    // });

    const [displayChat, setDisplayChat] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [selectedTab, setSelectedTab] = useState("contacts");

    const chat_page_ref = useRef(null);
    function toggleChat() {
        setDisplayChat(!displayChat);

        if (displayChat) {
            chat_page_ref.current.classList.remove('show')
            chat_page_ref.current.classList.add('hide')

        } else {
            chat_page_ref.current.classList.remove('hide')
            chat_page_ref.current.classList.add('show')
        }

    }


    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.body.setAttribute("data-theme", darkMode ? "light-theme" : "dark-theme");
    }

    // if (selectedTab === "contacts") {
    //     var eventlistener = getEventListeners(window)["DOMContentLoaded"][index];
    //     window.removeEventListener("DOMContentLoaded",
    //         eventlistener.listener,
    //         eventlistener.useCapture);
    // }

    // useEffect(() => {
    //     setTimeout(() => {
    //         setDisplayChat(!displayChat);
    //     }, 1500)
    // }, [displayChat])

    return (
        <div className="Chat layout-wrapper">

            {/* <button className='test-button' onClick={toggleChat}>Test</button> */}

            {/* menu bar (tabs and icons) */}

            <Menu
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            {/* chat tabs and other tabs */}
            <div className="tab-content">
                {selectedTab === "contacts" && <ContactsTab />}
                {selectedTab === "groups" && <GroupsTab />}
                {selectedTab === "settings" && <SettingsTab darkMode={darkMode} setDarkMode={toggleDarkMode} />}
            </div>

            {/* chat content */}
            <div className='chat-content' ref={chat_page_ref}></div>
        </div>
    )
}