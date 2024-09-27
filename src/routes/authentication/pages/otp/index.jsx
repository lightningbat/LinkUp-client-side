import icon_small from '../../../../assets/icon_small.png'

import './style.scss'
import '../../../../style/pageTransition_anime.scss'

import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';

// loading animation library
import LoadingIcons from 'react-loading-icons'

import AuthenticationService, { saveToken, savePassResetToken } from '../../../../services/authenticationService';
export default function OTP_Page({ changePage, setRoute, redirectedFrom, userEmail, pageTransitionStyle }) {

    const [otp, setOtp] = useState('');
    // display time left to resend OTP
    const [counter, setCounter] = useState(60);
    // to show error ( type could contain "username", "email", "password" or "server")
    const [fetchError, setError] = useState({ type: null, message: null })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (counter > 0) {
            setTimeout(() => setCounter(counter - 1), 1000);
        }
    }, [counter]);

    const resetTimer = () => {
        setCounter(60);
    }

    const resendOTP = async () => {
        if (counter !== 0 || submitting) return;

        const url = import.meta.env.VITE_SERVER_URL + "/resendOTP";
        const response = await AuthenticationService(url, { email: userEmail })

        if (response.status === 200) {
            resetTimer();
        } else {
            setError({ type: response.type, message: response.message });
        }
    }

    const handleSubmit = async () => {
        if (submitting) return

        if (otp.length !== 4) {
            setError({ type: "otp", message: "Please enter a valid OTP" });
            return;
        }

        setSubmitting(true);
        setError({ type: null, message: null });
        const url = import.meta.env.VITE_SERVER_URL + "/verifyOTP";
        const response = await AuthenticationService(url, { email: userEmail, otp: Number(otp) });

        if (response.status === 200) {
            if (otp < 5000) {
                saveToken(response.data.token);
                setRoute('chat');
            }
            else if (otp >= 5000 && otp < 10000) {
                savePassResetToken(response.data.token);
                changePage('resetPass');
            }
        } else {
            setError({ type: response.type, message: response.message });
            setSubmitting(false);
        }
    }

    return (
        <div className='otp' style={{ animationName: pageTransitionStyle }}>
            <div className="container">
                <div className='logo'>
                    <img src={icon_small} alt="logo" />
                    <h1><span className='light'>Link</span>Up</h1>
                </div>
                <h4>Verify</h4>
                <div className="card">
                    <p>Enter the <span style={{ fontWeight: "700" }}>OTP</span> sent to your email Id</p>
                    <p className='email-display'>{userEmail}</p>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        inputType='number'
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                            border: fetchError.type === "otp" ? "1px solid red" : "1px solid #474747",
                            borderRadius: "8px",
                            width: "40px",
                            height: "40px",
                            fontSize: "16px",
                            color: "#000",
                            fontWeight: "400",
                            caretColor: "blue"
                        }}
                        shouldAutoFocus={true}
                        containerStyle={{ justifyContent: "center", gap: "2em", margin: "4em 0 1.5em" }}
                        placeholder='----'
                    />
                    <div className="error-message">{fetchError.message}</div>
                    <p className='resend-title'>Didn't get the OTP?</p>
                    <p className={`resend-btn ${counter === 0 ? "active" : ""}`}>
                        <span className='text' onClick={resendOTP}>Resend</span>
                        {counter > 0 && <span> in {counter}</span>}
                    </p>

                    <div className='btn-container'>
                        {submitting ? <LoadingIcons.ThreeDots fill='#6159CB' height={25} /> :
                            <button onClick={handleSubmit} >Validate</button>}
                    </div>

                </div>
                    
                <p className='edit-email'>Entered wrong Email Id? <span onClick={() => changePage(redirectedFrom, false, "back")}>Edit</span></p>
            </div>
        </div>
    )
}