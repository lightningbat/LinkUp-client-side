import './style.scss'
import { useEffect, useRef, useState } from 'react'
import { BlockedContactBox, OutsideClickDetector } from '../../../../../../components/chat_page_comp'

export default function BlockedList({ closeFragment }) {

    const [showUnblockPopup, setShowUnblockPopup] = useState(false)
    
    const blocked_list = [
        {
            contact_id: 1,
            display_name: "John Doe",
            username: "johndoe",
            profile_pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            bg_color: "rgb(44, 112, 139)",
        },
        {
            contact_id: 2,
            display_name: "Lisa Doe",
            username: "lisadoe",
            profile_pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            bg_color: "rgb(44, 112, 139)",
        },
        {
            contact_id: 3,
            display_name: "John wick",
            username: "johnwick",
            profile_pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            bg_color: "rgb(44, 112, 139)",
        },
    ]

    // use id to get account data from the list and display
    const [selectedUserInfo, setSelectedUserInfo] = useState({contact_id: null, display_name: null, username: null, profile_pic: null, bg_color: null}) // for unblock confirmation

    const closeConfirmPopup = () => {
        setShowUnblockPopup(false)
    }

    const confirmUnblock = (contact_id) => {
        const contact = blocked_list.find(obj => obj.contact_id === contact_id)
        setSelectedUserInfo(contact)
        setShowUnblockPopup(true)
    }

    const element = useRef(null)

    useEffect(() => {
        element.current.addEventListener("mousemove", function (e) {
            const distanceX = element.current.offsetLeft + element.current.offsetWidth - e.pageX;
            if ((element.current.offsetTop < e.pageY && e.pageY < element.current.offsetTop + element.current.offsetHeight) && (distanceX < 15 && distanceX > 0)) {
                element.current.classList.add('more-width')
            }
            else {
                element.current.classList.remove('more-width')
            }
        })
    }, [])

    return (
        <div className="blocked-list" ref={element} style={{ overflow: showUnblockPopup && "hidden" }}>
            {showUnblockPopup && <OutsideClickDetector closePopup={closeConfirmPopup} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100000 }}>
                <div className="confirm-popup">
                    <label>Confirm Unblock</label>
                    <div className='profile-01'>
                        <div className="profile-icon">
                            {selectedUserInfo.profile_pic ?
                                <img src={selectedUserInfo.profile_pic} alt="" />
                                    :
                                <h3>{ selectedUserInfo.display_name.charAt(0).toUpperCase() }</h3>
                            }
                        </div>
                        <div className="profile-info">
                            <h3>{selectedUserInfo.display_name}</h3>
                            <p>{selectedUserInfo.username}</p>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="cancel-btn" onClick={closeConfirmPopup}>Cancel</button>
                        <button className="confirm-btn">Confirm</button>
                    </div>
                </div>
            </OutsideClickDetector>}
            <div className="header">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={closeFragment} width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                <p>Blocked List</p>
            </div>
            <div className="body">
                {/* <p>No blocked users</p> */}
                {blocked_list.map((item, index) => <BlockedContactBox key={index} {...item} showUnblockPopup={confirmUnblock} />)}
            </div>
        </div>
    )
}