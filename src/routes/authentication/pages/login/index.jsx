// signup page and login page uses same style file
import '../../../../style/authentication.scss'

import './style.scss'
import '../../../../style/pageTransition_anime.scss'

import icon_small from '../../../../assets/icon_small.png'

import { EmailInputBox, PasswordInputBox, SubmitButton } from '../../../../components/form_comp'

// loading animation library
import LoadingIcons from 'react-loading-icons'

import AuthenticationService, { saveToken } from '../../../../services/authenticationService'

import { useState, useRef } from 'react'

/*
    vite react app uses 
    import.meta.env.VITE_{xyz}
    instead of
    process.env.{xyz} or process.env.REACT_APP_{xyz} (for apps created by "create react app" command) 
*/
const base_url = import.meta.env.VITE_SERVER_URL

export default function Login({ setRoute, changePage, defaultValue, setUserInput, pageTransitionStyle }) {

    // to disable form editing during submission and to show loading animation
    const [submitting, setSubmitting] = useState(false)
    // to show error ( type could contain "username", "email", "password" or "server")
    const [fetchError, setError] = useState({ type: null, message: null })

    // references for form inputs
    const _email = useRef(null)
    const _password = useRef(null)

    const url = base_url + "/login"

    const setErrorStatus = (type, message) => {
        setError({ type, message })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true);
        setErrorStatus(null, null)

        const input_value = {
            "email": _email.current.value,
            "password": _password.current.value
        }

        const res = await AuthenticationService(url, input_value)
        
        if (res.status == 200) {
            if (!res.data.verified) {
                setUserInput(input_value)
                changePage("otp")
            }
            else {
                saveToken(res.data.token)
                setRoute("chat")
            }
        }
        else {
            setSubmitting(false)
            setErrorStatus(res.type, res.message)
        }
    }

    return (
        <div className='login' style={{ animationName: pageTransitionStyle }}>
            <div className='container'>
                <div className='logo'>
                    <img src={icon_small} alt="logo" />
                    <h1><span className='light'>Link</span>Up</h1>
                </div>
                <h4>Login</h4>
                <p>Login to continue to LinkUp</p>
                <div className="card">
                    <form action="" onSubmit={(e) => handleSubmit(e)}>
                        <fieldset disabled={submitting}>
                            <EmailInputBox ref={_email} error={(fetchError.type) === "email" && true} default_value={defaultValue.email} />
                            <PasswordInputBox withForgotPass={true} forgotPass={() => changePage("forgotPass", true)} ref={_password} error={(fetchError.type) === "password" && true} default_value={defaultValue.password} />
                            <div className="error-message">{fetchError.message}</div>
                            <div className='btn-container'>
                                {!submitting ? <SubmitButton title={"Login"} /> :
                                    <LoadingIcons.ThreeDots fill='#6159CB' height={25} />}
                            </div>
                        </fieldset>
                    </form>
                </div>
                <p className='link'>Don't have an account? <span className='link-span' onClick={() => changePage("signup", true, "back")}>Sign up</span></p>
            </div>
        </div>
    )
}