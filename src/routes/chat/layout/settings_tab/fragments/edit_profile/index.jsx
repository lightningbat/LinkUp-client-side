import './style.scss'
import { useRef, useContext, useState } from 'react'
import { InputBox } from '../../../../../../components/chat_page_comp'
import PropTypes from 'prop-types'
import FetchService from '../../../../../../services/fetchService'
import { getToken } from '../../../../../../services/authenticationService'
import { GlobalStateContext } from '../../../../../../context'

EditProfile.propTypes = {
    closeFragment: PropTypes.func
}
export default function EditProfile({ closeFragment }) {
    const display_name_ref = useRef(null)

    const { currentUser } = useContext(GlobalStateContext)
    const { display_name } = currentUser
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        // removing whitespace
        display_name_ref.current.value = display_name_ref.current.value.trim()
        const value = display_name_ref.current.value

        if (value == display_name) { // if no change
            setLoading(false)
            closeFragment()
            return
        }
        
        const response = await FetchService("updateProfile", { display_name: value, token: getToken() })
        if (response.ok) {
            setLoading(false)
            closeFragment()
        }
        else {
            let err_msg = "Error while editing profile"
            if (response.responseType == 'json') {
                err_msg = response.responseData.message
            }
            else if (response.responseType == 'text') {
                err_msg = response.responseData
            }
            setError(err_msg)
            setLoading(false)
        }
    }

    return (
        <div className="edit-profile">
            <div className="header">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={closeFragment} width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                </svg>
                <p>Edit Profile</p>
            </div>
            <form onSubmit={handleFormSubmit}>
                <fieldset disabled={loading}>
                    <div className="body">
                        <InputBox 
                            label_text="Display Name" 
                            input_type="text" 
                            pattern='^[a-zA-Z0-9_\- ]*$'
                            title='Only letters, numbers, spaces, hyphens and underscores'
                            minLength={1} maxLength={20} 
                            placeholder="Enter display name" 
                            default_value={display_name} 
                            ref={display_name_ref}
                            error={error} />
                    </div>
                    <div className="footer no-select">
                        <input type="submit" value="Save" className='save-btn' />
                        <input type='button' value="Cancel" className='cancel-btn' onClick={closeFragment} />
                    </div>
                </fieldset>
            </form>
        </div>
    )
}