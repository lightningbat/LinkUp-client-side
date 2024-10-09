import './style.scss'
import { UserSearchBox, ContactBox, AddContactBox } from "../../../../components/chat_page_comp"

import { useEffect, useRef, useState } from 'react';

import contact_data from '../../../../test_data/contact_data.json'

export default function ContactsTab({ visibility }) {

    // reference to the list container
    const element = useRef(null)
    const user_search_box_ref = useRef();
    const [showAddContactBox, setShowAddContactBox] = useState(false);
    const add_contact_box_ref = useRef();

    // add "more-width" class to the list container when the mouse moves over it
    // this makes the scrollbar more wider
    useEffect(() => {
        element.current.addEventListener("mousemove", function (e) {
            const ele = document.querySelector('.contacts-list-container');
            const distanceX = element.current.offsetLeft + element.current.offsetWidth - e.pageX;
            if ((element.current.offsetTop < e.pageY && e.pageY < element.current.offsetTop + element.current.offsetHeight) && (distanceX < 15 && distanceX > 0)) {
                element.current.classList.add('more-width')
            }
            else {
                element.current.classList.remove('more-width')
            }
        })
    }, [])

    // sorting the contact data by last message time
    const sorted_contact_data = contact_data.sort((a, b) => {
        const dateA = new Date(a.last_message_time).getTime()
        const dateB = new Date(b.last_message_time).getTime()
        if (dateA > dateB) {
            return -1
        }
        if (dateA < dateB) {
            return 1
        }
        return 0
    })

    return (
        <div className={`contacts-tab ${visibility}`}>
            <div className='left-right'>
                <div className='add-user-btn' onClick={() => setShowAddContactBox(!showAddContactBox)} ref={add_contact_box_ref}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </div>
                <UserSearchBox ref={user_search_box_ref} />
            </div>
            <div className="contacts-list-container" ref={element}>
                <div className="contacts-list">
                    {sorted_contact_data.map((contact) => <ContactBox key={contact.contact_id} {...contact} />)}
                </div>
                <div className="search-result">

                </div>
            </div>
            {showAddContactBox && <AddContactBox closePopup={() => setShowAddContactBox(false)} btnRef={add_contact_box_ref} />}
        </div>
    )
}