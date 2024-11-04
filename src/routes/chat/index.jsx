import './style.scss';

import { Menu, ContactsTab, GroupsTab, SettingsTab, UserChat } from './layout'
import { getToken } from '../../services/authenticationService'
import { useEffect, useState } from 'react';
import { socket } from '../../socket';

export default function Chat() {

    // socket connection
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

    const [selectedTab, setSelectedTab] = useState("contacts"); // "contacts" : chat tab, "groups" : group tab, "settings" : settings tab
    // to open/close chat
    // null : hidden
    // true : opens with slide animation
    // false : closes with slide animation
    const [displayChat, setDisplayChat] = useState(null);
    // id of the contact to open
    const [selectedContactId, setSelectedContactId] = useState(null);

    const openChat = (contact_id) => {
        // if the same chat is already open
        if (displayChat && selectedContactId == contact_id) return;

        setSelectedContactId(contact_id);
        setDisplayChat(true);
    }
    const closeChat = () => {setDisplayChat(false); setSelectedContactId(null);}


    return (
        <div className="Chat layout-wrapper">
            {/* menu bar (tabs and icons) */}
            <Menu
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />

            {/* chat tabs and other tabs */}
            <div className="tab-content">
                <ContactsTab show={selectedTab === "contacts"} openChat={openChat} selectedContactId={selectedContactId} />
                <GroupsTab show={selectedTab === "groups"} />
                <SettingsTab show={selectedTab === "settings"} />
            </div>

            {/* chat content */}
            {displayChat != null && <UserChat show={displayChat} closeChat={closeChat} contact_id={selectedContactId} />}
            {displayChat == null && <div className="no-selected-chat" />
            }
        </div>
    )
}