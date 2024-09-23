// signup page and login page uses same style file
import '../../../../style/authentication.scss'

import './style.scss'
import '../../../../style/pageTransition_anime.scss'

import icon_small from '../../../../assets/icon_small.png'

import { EmailInputBox, PasswordInputBox, UserNameInputBox, SubmitButton } from '../../../../components/form_comp'

// loading animation library
import LoadingIcons from 'react-loading-icons'

import AuthenticationService from '../../../../services/authenticationService'

import { useState, useRef } from 'react'

/*
    vite react app uses 
    import.meta.env.VITE_{xyz}
    instead of
    process.env.{xyz} or process.env.REACT_APP_{xyz} (for apps created by "create react app" command) 
*/
const base_url = import.meta.env.VITE_SERVER_URL

/**
 * 
 * @param {string} changePage - function to change the page
 * @param {object} defaultValue - default value of the form
 * @param {function} setUserInput - function to set the user input (defaultValue)
 * @returns {JSX.Element} signup page
 */
export default function SignUp({ changePage, defaultValue, setUserInput, pageTransitionStyle }) {

    // to disable form editing during submission and to show loading animation
    const [submitting, setSubmitting] = useState(false)
    // to show error ( type could contain "username", "email", "password" or "server")
    const [fetchError, setError] = useState({type: null, message: null})

    // references for form inputs
    const _display_name = useRef(null)
    const _email = useRef(null)
    const _password = useRef(null)

    const url = base_url + "/register"

    const setErrorStatus = (type, message) => {
        setError({type, message})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true);
        setErrorStatus(null, null)

        if ((_display_name.current.value).trim() == 0) {
            // if display name is empty or whitespaces
            setSubmitting(false)
            setErrorStatus("display_name", "Please enter a username")
            return
        }

        const data = {
            "display_name": _display_name.current.value,
            "email": _email.current.value,
            "password": _password.current.value
        }

        const res = await AuthenticationService(url, data)

        if (res.status == 200) {
            setUserInput(data)
            changePage("otp")
        }
        else {
            setSubmitting(false)
            setErrorStatus(res.type, res.message)
        }
    }

    return (
        <div className='signup' style={{animationName: pageTransitionStyle}}>
            <div className='container'>
                <div className='logo'>
                    <img src={icon_small} alt="logo" />
                    <h1><span className='light'>Link</span>Up</h1>
                </div>
                <h4>Sign up</h4>
                <p>Get your LinkUp account now</p>
                <div className="card">
                    <form action='' onSubmit={(e) => handleSubmit(e)}>
                        <fieldset disabled={submitting}>
                            <UserNameInputBox ref={_display_name} error={(fetchError.type) === "display_name" && true} default_value={defaultValue.display_name} />
                            <EmailInputBox ref={_email} error={(fetchError.type) === "email" && true} default_value={defaultValue.email} />
                            <PasswordInputBox ref={_password} error={(fetchError.type) === "password" && true} default_value={defaultValue.password} />
                            <div className="error-message">{fetchError.message}</div>
                            <div className='btn-container'>
                                {!submitting ? <SubmitButton title={"Sign up"} /> :
                                    <LoadingIcons.ThreeDots fill='#6159CB' height={25} />}
                            </div>
                        </fieldset>
                    </form>
                </div>

                <p className='link'>Already have an account? <span className='link-span' onClick={() => changePage("login", true, "next")}>Login</span></p>
            </div>
        </div>
    )
}