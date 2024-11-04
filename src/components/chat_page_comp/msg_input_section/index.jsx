import PropTypes from 'prop-types';
import './style.scss'
import { useEffect, useRef, useState } from 'react';

MsgInputSection.propTypes = {
    sendMsg: PropTypes.func
}
export default function MsgInputSection({ sendMsg }) {
    const textarea_ref = useRef(null)
    const [isInputFocused, setIsInputFocused] = useState(false)

    function handleTextAreaChange(e) {
        if (CSS.supports("field-sizing", "content")) return;
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    // keyboard shortcuts for send button
    useEffect(() => {
        const handleKeyDownListener = (e) => {
            // checking if control and enter is pressed at the same time
            if (e.ctrlKey && e.key === 'Enter') {
                clickedSendBtn()
            }
        }
        // adding and removing the event listener based on the input focus state
        if (isInputFocused) {
            document.addEventListener('keydown', handleKeyDownListener)
        }
        else {
            document.removeEventListener('keydown', handleKeyDownListener)
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDownListener)
        }
    }, [isInputFocused])

    function clickedSendBtn() {
        let input_value = textarea_ref.current.value
        // removing whitespace
        input_value = input_value.trim()
        if (input_value == "") return
        
        sendMsg(1, input_value)
        textarea_ref.current.value = ""
    }

    return (
        <div className="message-box">
            <textarea placeholder="Message..." onChange={handleTextAreaChange} ref={textarea_ref} onFocus={() => setIsInputFocused(true)} onBlur={() => setIsInputFocused(false)}/>
            <div className='send-btn' onClick={clickedSendBtn}>
                <svg width="321" height="339" viewBox="0 0 321 339" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M312.482 187.783C323.236 182.262 323.503 166.987 312.948 161.093L27.9189 1.95637C16.8285 -4.23516 3.50231 5.15772 5.60598 17.6832L30.5233 166.11L140.286 168.027L140.101 178.643L29.6299 176.716L0.321431 320.379C-2.21758 332.825 10.7739 342.677 22.0712 336.876L312.482 187.783Z"/>
                </svg>
            </div>
        </div>
    )
}