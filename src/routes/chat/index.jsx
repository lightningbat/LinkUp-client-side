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
    const [selectedTab, setSelectedTab] = useState("contacts"); // "contacts" : chat tab, "groups" : group tab, "settings" : settings tab

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


    return (
        <div className="Chat layout-wrapper">
            {/* menu bar (tabs and icons) */}
            <Menu
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            
            {/* chat tabs and other tabs */}
            <div className="tab-content">
                <ContactsTab show={selectedTab === "contacts"} />
                <GroupsTab show={selectedTab === "groups"} />
                <SettingsTab show={selectedTab === "settings"} />
            </div>

            {/* chat content */}
            <div className='chat-content' ref={chat_page_ref}></div>
        </div>
    )
}