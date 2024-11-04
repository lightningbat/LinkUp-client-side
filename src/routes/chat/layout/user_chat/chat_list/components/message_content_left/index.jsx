import './style.scss'
import PropTypes from 'prop-types'
import dateFormatter from '../../../dateFormatter'
import { OutsideClickDetector } from '../../../../../../../components/chat_page_comp'
import { useRef, useState } from 'react'

MessageContentLeft.propTypes = {
    msg_id: PropTypes.string.isRequired,
    msg_type: PropTypes.number.isRequired,
    msg: PropTypes.string.isRequired,
    edited: PropTypes.bool.isRequired
}
export default function MessageContentLeft({ msg_id, msg_type, msg, timestamp, edited }) {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownBtnRef = useRef(null)

    const device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    const drop_down_menu_direction = device_width > 450 ? {left: '5px'} : {right: '5px'}

    return (
        <div className='message-content-left' id={msg_id}>
            <div className='content'>
                {msg_type === 1 && <p className="text-msg">{msg}</p>}
                <div className="msg-info no-select">
                    <span className="time-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                        </svg>
                    </span>
                    <span className="time">{dateFormatter(timestamp, false, true)}</span>
                    {edited &&
                        <span className="edited-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </span>
                    }
                </div>
            </div>
            <div className="drop-down-menu no-select" style={{ display: showDropdown ? 'block' : 'none' }}>
                <span className="drop-down-btn" onClick={() => setShowDropdown(!showDropdown)} ref={dropdownBtnRef}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </span>
                {showDropdown &&
                    <OutsideClickDetector closePopup={() => setShowDropdown(false)} buttonRef={dropdownBtnRef} style={{ position: 'absolute', top: '25px', ...drop_down_menu_direction, zIndex: 1 }}>
                        <div className="menu-container">
                            <ul>
                                <li className='menu-item'>Copy</li>
                            </ul>
                        </div>
                    </OutsideClickDetector>
                }
            </div>
        </div>
    )
}