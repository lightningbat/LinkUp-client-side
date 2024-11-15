import './style.scss';

import { Menu, ContactsTab, GroupsTab, SettingsTab, UserChat } from './layout'
import { getToken } from '../../services/authenticationService'
import { useContext, useEffect, useRef, useState } from 'react';
import { socket } from '../../socket';
import { GlobalStateContext } from '../../context';

export default function Chat() {

    const { contactsList, setContactsList, updateContactsChatData, sortContactsList } = useContext(GlobalStateContext);

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
    
    /*
    There was some error causing the selectedContactId to be null when:-
    1. matching with sender_id on receiving new message
    2. updating unread_count in addNewMessage

    The solution was to store the selectedContactId in a useRef hook and updates its value in useEffect */
    const [selectedContactId, setSelectedContactId] = useState(null); // uuid of the selected contact(open chat)
    const selected_contact_id = useRef(null);

    useEffect(() => {
        selected_contact_id.current = selectedContactId;
        console.log("new selectedContactId", selectedContactId);
        if (!selectedContactId) return;

        const { chat_id, unread_count} = contactsList.find(contact => contact.user_id == selectedContactId);
        if (!chat_id) return;
        if (unread_count && unread_count > 0) {
            // setting unread_count to 0 locally
            setContactsList((prevContactsList) => 
                prevContactsList.map(contact => 
                    contact.user_id === selectedContactId 
                        ? { 
                            ...contact, 
                            unread_count: 0 
                        }
                        : contact
                )
            );

            // setting unread_count to 0 in the database
            socket.emit("reset_unread_count", selectedContactId);
        }
    }, [selectedContactId]);

    const openChat = (contact_id) => {
        // if the same chat is already open
        if (displayChat && selectedContactId == contact_id) return;

        setSelectedContactId(contact_id);
        setDisplayChat(true);
    }
    const closeChat = () => {setDisplayChat(false); setSelectedContactId(null);}

    /**
     * @description updates chat_id, unread_count and last_message_info in contactsList and also creates an empty array in contactsChatData with the contact_id as key
     * @param {string} chat_id - chat id
     * @param {number} msg_type - 1 for text, 2 for image
     * @param {string} msg_id - message id
     * @param {string} msg - message content
     * @param {number|string|Date} timestamp - message timestamp
     * @param {number} sender - 1 for current user, 2 for other user
     * @param {string} contact_id - id of the contact to match
     */
    const createNewChat = (chat_id, msg_type, msg_id, msg, timestamp, sender, contact_id) => {
        // updating *chat_id*, unread_count and last_message_info in contactsList
        setContactsList((prevContactsList) =>
            sortContactsList(prevContactsList.map(contact => 
                contact.user_id === contact_id 
                    ? {
                        ...contact, 
                        chat_id, 
                        unread_count: 0, 
                        last_message_info: { sender, msg_type, msg_id, msg, timestamp }
                    }
                    : contact
            ))
        );

        // crating empty array in contactsChatData
        updateContactsChatData((draft) => {
            draft[contact_id] = [];
        })
    }

    /**
     * @description adds a new message to the contactsChatData and updates last_message_info and unread_count in contactsList
     * @param {string} contact_id - id of the contact
     * @param {number} sender - 1 for current user, 2 for other user
     * @param {number} msg_type - 1 for text, 2 for image
     * @param {string} msg_id - message id
     * @param {string} msg - message content
     * @param {string|number|Date} timestamp - message timestamp
     */
    const addNewMessage = (contact_id, sender, msg_type, msg_id, msg, timestamp) => {
        // adding the message to the chat
        updateContactsChatData((draft) => {
            draft[contact_id] = [
                ...draft[contact_id],
                {
                    "sender": sender,
                    "msg_type": msg_type,
                    "msg_id": msg_id,
                    "msg": msg,
                    "timestamp": timestamp,
                    "edited": false
                }
            ]
        })
        
        // updating last_message_info and unread_count in contactsList
        setContactsList((prevContactsList) => 
            sortContactsList(prevContactsList.map(contact => 
                contact.user_id === contact_id 
                    ? {
                        ...contact,
                        last_message_info: { sender, msg_type, msg_id, msg, timestamp },
                        // if sender is other user and that sender chat is not currently open
                        unread_count: (selected_contact_id.current != contact_id) && sender == 2 ? contact.unread_count + 1 : contact.unread_count // updating unread count if sender is other user and contact is not currently open
                    }
                    : contact
            ))
        );
    }

    /**
     * @param {number} msg_type - 1 for text, 2 for image
     * @param {string} msg - message
     */
    function sendMsg(msg_type, msg) {
        const errorSendingMsg = (err) => {
            console.log(err);
        }
        const msgSended = (response) => {
            console.log(response);
            if (response?.chat_id) { // first time sending message
                createNewChat(response.chat_id, msg_type, response.msg_id, msg, response.timestamp, 1, selected_contact_id.current);
            }
            // adding the message to the chat
            addNewMessage(selected_contact_id.current, 1, msg_type, response.msg_id, msg, response.timestamp);
        }
        socket.timeout(5000).emit("send_msg", { contact_id: selected_contact_id.current, msg_type, msg }, (err, res) => {
            if (err) errorSendingMsg(err);
            else msgSended(res);
        });
    }

    useEffect(() => {
        function new_msg(data) {
            // setting unread_count to 0 in the database if sender is the selected contact
            console.log("received new message", data);
            // setting unread_count to 0 in the database if sender is same as selected contact
            console.log("selectedContactId", selected_contact_id.current);
            console.log("is same id", data.sender_id == selected_contact_id.current);
            if (data.sender_id == selected_contact_id.current) {
                socket.emit("reset_unread_count", data.sender_id);
            }
            if (data.chat_id) {
                createNewChat(data.chat_id, data.msg_type, data.msg_id, data.msg, data.timestamp, 2, data.sender_id);
            }
            addNewMessage(data.sender_id, 2, data.msg_type, data.msg_id, data.msg, data.timestamp);
        }
        function sync_msg(data) {
            console.log("received sync message", data);
            if (data.chat_id) {
                createNewChat(data.chat_id, data.msg_type, data.msg_id, data.msg, data.timestamp, 1, data.receiver_id);
            }
            addNewMessage(data.receiver_id, 1, data.msg_type, data.msg_id, data.msg, data.timestamp);
        }

        socket.on("receive_msg", new_msg);
        socket.on("sync_msg", sync_msg);

        return () => {
            socket.off("receive_msg", new_msg);
            socket.off("sync_msg", sync_msg);
        }
    }, [])

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
            {displayChat != null && <UserChat show={displayChat} closeChat={closeChat} contact_id={selectedContactId} sendMsg={sendMsg} />}
            {displayChat == null && <div className="no-selected-chat" />
            }
        </div>
    )
}