import './style.scss';

import { Menu, ContactsTab, GroupsTab, SettingsTab } from './layout'
import { getToken } from '../../services/authenticationService'
import { useEffect, useState, useRef } from 'react';
import { socket } from '../../socket';

export default function Chat() {
    useEffect(() => {
        socket.auth.token = getToken();
        socket.connect();

        /* ****** for testing purposes ****** */
        // setTimeout(() => {
        //     if (socket.io.engine) {
        //         socket.io.engine.close()
        //     }
        // }, 5000)

        return () => {
            socket.disconnect();
        }
    }, []);
    
    const [displayChat, setDisplayChat] = useState(false);
    const [selectedTab, setSelectedTab] = useState("contacts");
    // sets the style of the tab based on the selected tab
    // "null" : not loaded
    // "visible" : visible and loaded
    // "hidden" : hidden but loaded
    const [chatTabVisibility, setChatTabVisibility] = useState(null);
    const [groupTabVisibility, setGroupTabVisibility] = useState(null);
    const [settingsTabVisibility, setSettingsTabVisibility] = useState(null);

    // update the visibility of the selected tab when a new tab is selected
    useEffect(() => {
        hideLastTab();
        if (selectedTab === "contacts") {
            setChatTabVisibility("visible");
        } else if (selectedTab === "groups") {
            setGroupTabVisibility("visible");
        } else if (selectedTab === "settings") {
            setSettingsTabVisibility("visible");
        }
    }, [selectedTab]);

    // hide the last tab when a new tab is selected
    function hideLastTab() {
        if (chatTabVisibility === "visible") {
            setChatTabVisibility("hidden");
        } else if (groupTabVisibility === "visible") {
            setGroupTabVisibility("hidden");
        } else if (settingsTabVisibility === "visible") {
            setSettingsTabVisibility("hidden");
        }
    }

    const chat_page_ref = useRef(null);
    // eslint-disable-next-line no-unused-vars
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


    // function toggleDarkMode() {
    //     setDarkMode(!darkMode);
    //     document.body.setAttribute("data-theme", darkMode ? "light-theme" : "dark-theme");
    // }

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
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            {/* chat tabs and other tabs */}
            <div className="tab-content">
                {/* only loads the tab if it was already loaded once before
                "null": not loaded
                "visible / hidden": loaded */}
                {chatTabVisibility !== null && <ContactsTab visibility={chatTabVisibility} />}
                {groupTabVisibility !== null && <GroupsTab visibility={groupTabVisibility} />}
                {settingsTabVisibility !== null && <SettingsTab visibility={settingsTabVisibility} />}
            </div>

            {/* chat content */}
            <div className='chat-content' ref={chat_page_ref}></div>
        </div>
    )
}