import './style.scss'
import { useState, forwardRef, useEffect } from 'react'

const UserSearchBox = forwardRef((props, ref) => {
    const [focused, setFocused] = useState(false)
    const [showClearBtn, setShowClearBtn] = useState(false)

    // keydown listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '/') {
                ref.current.focus()
                e.preventDefault()
            }
            if (e.key === 'Escape') {
                ref.current.blur()
            }
        }
        document.addEventListener('keydown', (e) => { handleKeyDown(e) })

        return () => {
            document.removeEventListener('keydown', (e) => { handleKeyDown(e) })
        }
    }, [])

    const onChange = () => {
        if (ref.current.value) setShowClearBtn(true); else setShowClearBtn(false)
    }

    const onFocus = () => {
        setFocused(true)
        ref.current.focus()
    }

    const onBlur = () => {
        if (ref.current.value === "") setFocused(false); ref.current.blur()
    }

    const cancelSearch = () => {
        ref.current.value = ""
        setShowClearBtn(false)
        setFocused(false)
    }

    const clearSearch = () => {
        ref.current.value = ""
        setShowClearBtn(false)
        ref.current.focus()
    }

    return (
        <div className="search-box">
            <div className='start-icon'>
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
            <input type="text" placeholder="Search UserName" ref={ref} onFocus={onFocus} onBlur={onBlur} onChange={onChange} />
            {showClearBtn && <div className='clear-icon' onClick={clearSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
            </div>}
        </div>
    )
})

export default UserSearchBox;