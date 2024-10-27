import './style.scss'
import { useRef } from 'react'
import { InputBox } from '../../../../../../components/chat_page_comp'
import PropTypes from 'prop-types'

EditPassword.propTypes = {
    closeFragment: PropTypes.func
}
export default function EditPassword({closeFragment}) {
    const current_password = useRef(null)
    const new_password = useRef(null)

    return (
        <div className="change-password">
            <div className="header">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={closeFragment} width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                <p>Change Password</p>
            </div>
            <h3 className="coming-soon">Coming Soon...</h3>
            {/* <div className="body">
                <InputBox label_text="Current Password" input_type="password" input_name="current_password" default_value="" ref={current_password} />
                <InputBox label_text="New Password" input_type="password" input_name="new_password" default_value="" ref={new_password} />
            </div>
            <div className="footer no-select">
                <button className='save-btn'>Save</button>
                <button className='cancel-btn' onClick={closeFragment}>Cancel</button>
            </div> */}
        </div>
    )
}