import './style.scss'
import { forwardRef, useState } from 'react'

/**
 * @param {Object} props - contains {input_type, default_value, placeholder, label_text, error}
 * @param {string} props.input_type - type of the input
 * @param {string} props.default_value - default value of the input
 * @param {string} props.placeholder - placeholder of the input
 * @param {string} props.label_text - text of the label
 * @param {string} props.error - error message
 * @param {string} props.pattern - pattern for the input
 * @param {number} props.minLength - minimum length of the input
 * @param {number} props.maxLength - maximum length of the input
 */
const InputBox = forwardRef((props, ref) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className={`component-input ${props.error && "error"}`}>
            {props.label_text && <label>{props.label_text}</label>}
            <div className='input-box'>
                <input type={showPassword ? "text" : props.input_type} style={{ paddingRight: props.input_type == "password" && "0" }} defaultValue={props.default_value} placeholder={props.placeholder} pattern={props.pattern} minLength={props.minLength} maxLength={props.maxLength} ref={ref} required />
                {props.input_type === "password" && <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884l-12-12 .708-.708 12 12-.708.708z" />
                        </svg>
                    }
                </div>}
            </div>
            {props.error && <p className="error-text">{props.error}</p>}
        </div>
    )
})

export default InputBox