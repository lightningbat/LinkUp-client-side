import './style.scss'
import { SearchBox, ContactBox } from "../../../../components/chat_page_comp"

import { useEffect, useRef } from 'react';

import contact_data from '../../../../test_data/contact_data.json'

export default function ContactsTab({visibility}) {

    // reference to the list container
    const element = useRef(null)

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
            <SearchBox />
            <div className="contacts-list-container" ref={element}>
                <div className="contacts-list">
                    {sorted_contact_data.map((contact) => <ContactBox key={contact.contact_id} {...contact} />)}
                </div>
                <div className="search-result"></div>
            </div>
        </div>
    )
}