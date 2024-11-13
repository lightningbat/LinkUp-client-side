import './style.scss'
import { DateTitle, MessageContentLeft, MessageContentRight } from './components'
import { useContext, useEffect, useState } from 'react'
import { GlobalStateContext } from '../../../../../context'
import PropTypes from 'prop-types'

ChatList.propTypes = {
    selectedContactId: PropTypes.string
}
export default function ChatList({ selectedContactId }) {
    const { contactsChatData } = useContext(GlobalStateContext)
    const [chatList, setChatList] = useState([]);
    // sorting data into a separate array
    const sortedChatList = [];
    useEffect(() => {
        if (!contactsChatData[selectedContactId]) return;
        for (let i = 0; i < contactsChatData[selectedContactId].length; i++) {
            if (i == 0) {
                sortedChatList.push({
                    item_type: 'date',
                    date: contactsChatData[selectedContactId][i].timestamp
                })
            }
            if (i != 0 && !isSameDate(contactsChatData[selectedContactId][i].timestamp, contactsChatData[selectedContactId][i - 1].timestamp)) {
                sortedChatList.push({
                    item_type: 'date',
                    date: contactsChatData[selectedContactId][i].timestamp
                })
            }
            sortedChatList.push({
                item_type: contactsChatData[selectedContactId][i].sender == 1 ? 'message_right' : 'message_left',
                msg_id: contactsChatData[selectedContactId][i].msg_id,
                msg_type: contactsChatData[selectedContactId][i].msg_type,
                msg: contactsChatData[selectedContactId][i].msg,
                timestamp: contactsChatData[selectedContactId][i].timestamp,
                edited: contactsChatData[selectedContactId][i].edited
            })
        }
        setChatList(sortedChatList);

        // scrolling chat-list to the bottom
        const chatList = document.querySelector('.chat-list');
        if (chatList) {
            chatList.scrollTop = chatList.scrollHeight;
        }

        return () => {
            setChatList([]);
            sortedChatList.length = 0;
        }
    }, [selectedContactId, contactsChatData])

    function isSameDate(date1, date2) {
        date1 = new Date(date1);
        date2 = new Date(date2);
        return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
    }
    return (
        <div className="chat-list">
            <ul>
                {chatList && chatList.map((item, index) => {
                    if (item.item_type === 'date') {
                        return (
                            <li key={index}> <DateTitle date={new Date(item.date)} /> </li>
                        )
                    } else if (item.item_type === 'message_left') {
                        return (
                            <li key={index}> <MessageContentLeft msg_id={item.msg_id} msg_type={item.msg_type} msg={item.msg} timestamp={item.timestamp} edited={item.edited} /> </li>
                        )
                    } else if (item.item_type === 'message_right') {
                        return (
                            <li key={index}> <MessageContentRight msg_id={item.msg_id} msg_type={item.msg_type} msg={item.msg} timestamp={item.timestamp} edited={item.edited} /> </li>
                        )
                    }
                })}
            </ul>
        </div>
    )
}