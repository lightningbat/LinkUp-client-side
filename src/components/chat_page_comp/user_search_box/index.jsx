import './style.scss'
import { useState, forwardRef, useRef, useEffect } from 'react'

const UserSearchBox = forwardRef((props, ref) => {
    const [addUser, setAddUser] = useState(false)
    const [focused, setFocused] = useState(false)

    // useEffect(() => {
    //     ref.current.addEventListener("focus", () => setFocused(true))
    //     ref.current.addEventListener("blur", () => {
    //         if (ref.current.value === "") setFocused(false)
    //     })

    //     return () => {
    //         ref.current.removeEventListener("focus", () => setFocused(true))
    //         ref.current.removeEventListener("blur", () => {
    //             if (ref.current.value === "") setFocused(false)
    //         })
    //     }
    // }, [])


    const onFocus = () => {
        setFocused(true)
        ref.current.focus()
    }

    const onBlur = () => {
        if (ref.current.value === "") setFocused(false); ref.current.blur()
    }

    const cancelSearch = () => {
        ref.current.value = ""
        // after this onBlur will get called automatically
    }

    return (
        <div className="user-search-box">
            <div style={{ flex: "1", display: "flex", gap: "10px" }}>
                <div className={`add-user-btn ${addUser ? "active" : ""}`} onClick={() => setAddUser(!addUser)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </div>
                <div className="input-box">
                    <div className='icon'>
                        {!focused ? 
                            <svg onClick={onFocus} key={1} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                                :
                            <svg onClick={cancelSearch} key={2} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
                            </svg>
                        }
                    </div>
                    <input type="text" placeholder={addUser ? "Add User" : "Search User"} ref={ref} onFocus={onFocus} onBlur={onBlur} />
                </div>
            </div>
            <button className="search-btn" style={{ display: addUser ? "block" : "none" }} >Search</button>
        </div>
    )
})

export default UserSearchBox;