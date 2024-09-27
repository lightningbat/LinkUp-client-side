import icon_small from '../../../../assets/icon_small.png'

import './style.scss'
import '../../../../style/pageTransition_anime.scss'

import AuthenticationService, { getPassResetToken, removePassResetToken } from '../../../../services/authenticationService'
import { PasswordInputBox, SubmitButton } from '../../../../components/form_comp'
import { useState, useRef } from 'react'

// loading animation library
import LoadingIcons from 'react-loading-icons'
// custom toast library
import { toast } from 'react-custom-alert';

export default function ResetPass({ changePage, pageTransitionStyle }) {
    // to disable form editing during submission and to show loading animation
    const [submitting, setSubmitting] = useState(false)
    // to show error ( type could contain "email", "server", or something else)
    const [fetchError, setError] = useState({ type: null, reason: null, message: null })

    const _password = useRef(null)
    // to update "reset" button to "done" button 
    const [passUpdated, setPassUpdated] = useState(false)

    const setErrorStatus = (type, message) => {
        setError({ type, message })
    }

    const url = import.meta.env.VITE_SERVER_URL + "/reset-password"

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true);
        setError({type: null, message: null})

        const input_value = {
            "new_password": _password.current.value
        }

        const res = await AuthenticationService(url, { ...input_value, token: getPassResetToken() })

        if (res.status == 200) {
            removePassResetToken()
            setError({type: null, message: null})
            toast.success("Password reset successfully")
            setPassUpdated(true)
            setSubmitting(false)
            document.getElementsByTagName("form")[0].addEventListener("submit", () => { changePage("login", false, "back") })
        }
        else {
            setError({type: res.type, message:res.message})
            setSubmitting(false)
            if (res.type == "token") {
                removePassResetToken()
                document.getElementsByTagName("form")[0].addEventListener("submit", () => { changePage("forgotPass", false, "back") })
            }
        }
    }

    return (
        <div className='resetPass' style={{animationName: pageTransitionStyle}}>
            <div className='container'>
                <div className='logo'>
                    <img src={icon_small} alt="logo" />
                    <h1><span className='light'>Link</span>Up</h1>
                </div>
                <h4>Reset Password</h4>
                <div className="card">
                    <div className="account_info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                        </svg>
                        <p className="account_email">missionredelephant@gmail.com</p>
                    </div>
                    <form action="" onSubmit={(e) => handleSubmit(e)}>
                        <PasswordInputBox withForgotPass={false} ref={_password} error={(fetchError.type) === "password" && true} default_value={null} label="New Password" />
                        <div className="error-message">{fetchError.message}</div>
                        <div className='btn-container'>
                            {!submitting ? <SubmitButton title={fetchError.type == "token" ? "Request New OTP" : (passUpdated ? "Done" : "Reset")} /> :
                                <LoadingIcons.ThreeDots fill='#6159CB' height={25} />}
                        </div>
                    </form>
                </div>
                <p className='link'><span className='link-span' onClick={() => changePage("signup", true, "back")}>Sign up</span> / <span className='link-span' onClick={() => changePage("login", true, "back")}>Login</span></p>
            </div>
        </div>
    )
}