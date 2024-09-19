import './style.scss'
import { useRef } from 'react'
import { InputBox } from '../../../../../../components/chat_page_comp'

export default function EditProfile({closeFragment}) {
    const display_name = useRef(null)
    const username = useRef(null)

    return (
        <div className="edit-profile">
            <div className="header">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={closeFragment} width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                <p>Edit Profile</p>
            </div>
            <div className="body">
                <InputBox label_text="Display Name" input_type="text" input_name="display_name" default_value="User Name" ref={display_name} />
                <InputBox label_text="User Name" input_type="text" input_name="username" default_value="User Username #5464" ref={username} />
            </div>
            <div className="footer no-select">
                <button className='save-btn'>Save</button>
                <button className='cancel-btn' onClick={closeFragment}>Cancel</button>
            </div>
        </div>
    )
}