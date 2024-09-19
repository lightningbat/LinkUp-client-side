import './style.css'

import SignUp from './pages/signup'
import Login from './pages/login'
import OTP_Page from './pages/otp'
import ForgotPass from './pages/forgotPass'
import ResetPass from './pages/resetPass'

import { useState, useRef } from 'react'

import { ToastContainer } from 'react-custom-alert'
import 'react-custom-alert/dist/index.css'; // import css file from root.

export default function Authentication({setRoute}) {

    const [currentPage, setCurrentPage] = useState("signup")
    // holds the name of the page that was redirected from to the otp page
    const redirected_from = useRef(null)
    // const userInput = {username: null, email: null, password: null}
    // propagate the form page(register, login, forgotPass) if user want to edit input values (returned from otp page)
    const [userInput, setUserInput] = useState({username: null, email: null, password: null})

    const pageTransitionStyle = useRef()

    /**
     * 
     * @param {String} page name of the page
     * @param {Boolean} resetUserInput true if you want to reset the user input
     * @param {String} _pageTransitionStyle "next" or "back"
     */
    const changePage = (page, resetUserInput, _pageTransitionStyle = "next") => {
        if (resetUserInput) {
            setUserInput({username: null, email: null, password: null})
        }
        if (page == 'otp') {
            redirected_from.current = currentPage
        }

        setCurrentPage(page)
        pageTransitionStyle.current = _pageTransitionStyle
    }

    return (
        <div className='authentication'>
            <ToastContainer floatingTime={4000} />
            {(currentPage === "signup") && <SignUp
                changePage={changePage}
                defaultValue={userInput}
                setUserInput={setUserInput}
                pageTransitionStyle={pageTransitionStyle.current} />
            }
            {(currentPage === "login") && <Login
                changePage={changePage}
                setRoute={setRoute}
                defaultValue={userInput}
                setUserInput={setUserInput}
                pageTransitionStyle={pageTransitionStyle.current} />
            }
            {(currentPage === "otp") && <OTP_Page
                changePage={changePage}
                setRoute={setRoute}
                redirectedFrom={redirected_from.current}
                userEmail={userInput.email}
                pageTransitionStyle={pageTransitionStyle.current} />
            }
            {(currentPage === "forgotPass") && <ForgotPass
                changePage={changePage}
                setUserInput={setUserInput}
                defaultValue={userInput}
                pageTransitionStyle={pageTransitionStyle.current} />
            }
            {(currentPage === "resetPass") && <ResetPass
                changePage={changePage}
                defaultValue={userInput}
                pageTransitionStyle={pageTransitionStyle.current} />
            }
        </div>
    )
}