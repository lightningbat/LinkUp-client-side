import "./style.scss"
import PropTypes from "prop-types"
import { useContext, useEffect, useState } from "react";
import { GlobalStateContext } from "../../../../context";
import { MsgInputSection } from "../../../../components/chat_page_comp";
import ChatList from "./chat_list";
import dateFormatter from "./dateFormatter";
// import { socket } from "../../../../socket";

UserChat.propTypes = {
    show: PropTypes.bool,
    closeChat: PropTypes.func,
    contact_id: PropTypes.string,
    sendMsg: PropTypes.func
}
export default function UserChat({ show, closeChat, contact_id, sendMsg }) {
    const { contactsList } = useContext(GlobalStateContext);
    
    // contact info of the selected contact
    const [contactInfo, setContactInfo] = useState(null);
    // getting contact info from contactsList
    useEffect(() => {
        contactsList.forEach((contact) => {
            if (contact.user_id == contact_id) {
                setContactInfo(contact);
            }
        })
    }, [contactsList, contact_id]);

    return (
        <div className={`user-chat ${show ? "show" : "hide"}`}>
            <div className="top-bar">
                <div className="close-chat-btn" onClick={closeChat}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                    </svg>
                </div>
                {contactInfo &&
                    <div className="contact-info">
                        <div className="profile-icon" style={{ backgroundColor: contactInfo.bgColor }}>
                            {contactInfo?.profile_img ?
                                <img src={contactInfo.profile_img} alt="" />
                                    :
                                <p>{contactInfo?.display_name.charAt(0).toUpperCase()}</p>
                            }
                        </div>
                        <div>
                            <h3 className="username"><span className="username-icon">#</span>{contactInfo?.username}</h3>
                            <p className="user-status">
                                {contactInfo?.online ? 
                                    "Online" 
                                        : 
                                    contactInfo?.last_seen ?
                                        <><span className="last-seen-label">Last seen: </span> <span className="last-seen-time"> {dateFormatter(contactInfo?.last_seen)}</span></>
                                            : 
                                        "Offline"
                                }
                            </p>
                        </div>
                    </div>
                }
            </div>
            <ChatList key={`chat-list-${contact_id}`} selectedContactId={contact_id} />
            <MsgInputSection key={`msg-input-${contact_id}`} sendMsg={sendMsg} />
        </div>
    )
}