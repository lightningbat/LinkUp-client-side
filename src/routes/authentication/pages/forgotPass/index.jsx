import icon_small from '../../../../assets/icon_small.png'

import './style.scss'
import '../../../../style/pageTransition_anime.scss'

import AuthenticationService from '../../../../services/authenticationService'
import { EmailInputBox, SubmitButton } from '../../../../components/form_comp'
import { useState, useRef } from 'react'

// loading animation library
import LoadingIcons from 'react-loading-icons'

export default function ForgotPass({ changePage, defaultValue, setUserInput, pageTransitionStyle }) {
    const _email = useRef(null)

    // to disable form editing during submission and to show loading animation
    const [submitting, setSubmitting] = useState(false)
    // to show error ( type could contain "email", "server", or something else)
    const [fetchError, setError] = useState({ type: null, message: null })

    const setErrorStatus = (type, message) => {
        setError({ type, message })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitting(true);
        setErrorStatus(null, null)

        const input_value = {
            "email": _email.current.value
        }

        const url = import.meta.env.VITE_SERVER_URL + "/forgot-password"

        const res = await AuthenticationService(url, input_value)

        if (res.status == 200) {
            setUserInput(input_value)
            changePage("otp")
        }
        else {
            setSubmitting(false)
            setErrorStatus(res.type, res.message)
        }
    }
    
    return (
        <div className='forgotPass' style={{animationName: pageTransitionStyle}}>
            <div className='container'>
                <div className='logo'>
                    <img src={icon_small} alt="logo" />
                    <h1><span className='light'>Link</span>Up</h1>
                </div>
                <h4>Forgot Password?</h4>
                <div className="card">
                <p style={{ marginBottom: "20px" }}>Enter the email address associated with your account</p>
                    <form action="" onSubmit={(e) => handleSubmit(e)}>
                        <fieldset disabled={submitting}>
                            <EmailInputBox ref={_email} error={(fetchError.type) === "email" && true} default_value={defaultValue.email} withLabel={false} />
                            <div className="error-message">{fetchError.message}</div>
                            <div className='btn-container'>
                                {!submitting ? <SubmitButton title={"Continue"} /> :
                                    <LoadingIcons.ThreeDots fill='#6159CB' height={25} />}
                            </div>
                        </fieldset>
                    </form>
                </div>
                <p className='link'>Remember it? <span className='link-span' onClick={() => changePage("login", true, "back")}>Login</span></p>
            </div>
        </div>
    )
}