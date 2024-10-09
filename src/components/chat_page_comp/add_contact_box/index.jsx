import './style.scss';
import OutsideClickDetector from '../outside_click_detector';

import { useState, useRef, useEffect } from 'react';
import { BouncingDots } from '../../../custom/loading_animations';
import fetchService from '../../../services/fetchService';
import ContactBoxToBeAdded from './contact_box_to_be_added';
import { getToken } from '../../../services/authenticationService';

/* if we keep the local_cache outside the function, 
it will only be initialized once when the component mounts, 
and it will not be refreshed automatically when the user searches for a new contact. 
This is because the component is not re-rendered with a new props, 
but the state of the component changes. But if we keep the local_cache inside the function, 
it will be re-initialized every time the component is re-rendered. */

// temporally store the search results in local cache
let local_cache = [];

export default function AddContactBox({ closePopup, btnRef }) {
    const inputRef = useRef(null);
    const [showClearBtn, setShowClearBtn] = useState(false);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    // reset the local cache when the component unmounts
    const resetLocalCache = () => {
        local_cache = [];
    };
    useEffect(() => {
        return () => {
            resetLocalCache();
        };
    }, []);

    useEffect(() => {
        // focus the input when the component mounts
        inputRef.current.focus();

        // or to focus the input when "/" is pressed
        const handleKeyDown = (e) => {
            if (e.key === '/') {
                inputRef.current.focus();
                e.preventDefault();
            }
        }
        document.addEventListener('keydown', (e) => {handleKeyDown(e)} )

        return () => {
            document.removeEventListener('keydown', (e) => {handleKeyDown(e)} )
        }
    }, [])

    // to remove the contact from the local cache
    // once the contact is added
    const delCacheElement = ( user_id ) => {
        local_cache = local_cache.filter(contact => contact.user_id !== user_id);
    }

    const focusInput = () => {
        inputRef.current.focus();
    }

    const clearInput = () => {
        if (loading) return;
        inputRef.current.value = '';
        setShowClearBtn(false);
        inputRef.current.focus();
    }

    // make the clear button visible when the input is not empty
    const onChange = () => {
        if (inputRef.current.value) setShowClearBtn(true); else setShowClearBtn(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!showSearchResult) setShowSearchResult(true);
        setLoading(true);
        setSearchResult(null);

        const input_value = inputRef.current.value.toLowerCase();

        // to verify if the user is already in the local cache
        let in_local_cache = false;

        if (local_cache) {

            local_cache.forEach((contact, index, array) => {
                if (contact.username == input_value) {
                    setLoading(false);
                    setSearchResult(contact);
                    in_local_cache = true;
                }
            });
        }

        if (in_local_cache){ 
            return;
        } 

        const result = await fetchService('findUser', { token: getToken(), username: input_value });

        setLoading(false);
        
        if (result.ok) {
            // checking if the user is already in the local cache
            // if not, push to the local cache
            if (!local_cache.some((contact) => contact.username == input_value)) {
                local_cache.push({...result.responseData, username: input_value});
            }
            setSearchResult({...result.responseData, username: input_value});
        } else {
            let message = 'Something went wrong';
            if (result.responseType == 'json') {
                message = result.responseData.message;
            } else if (result.responseType == 'text') {
                message = result.responseData;
            }
            setSearchResult(message);
        }
    }

    return (
        <OutsideClickDetector closePopup={closePopup} buttonRef={btnRef} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="add-contact-box">
                <form className="add-contact-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="input-box">
                        <div className="search-icon" onClick={focusInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
                        </div>
                        <input type="text" placeholder='Enter username' onChange={onChange} pattern='^[a-zA-Z0-9]+$' title='Only letters and numbers' disabled={loading} ref={inputRef} required/>
                        {showClearBtn && <div className="clear-btn" onClick={clearInput}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </div>}
                    </div>
                    <button className="submit-btn" disabled={loading}>Find</button>
                </form>
                {showSearchResult && <div className="search-result">
                    {loading && <BouncingDots scale={1} />}
                    {searchResult && typeof searchResult === 'object' && <ContactBoxToBeAdded user_data={searchResult} delCacheElement={delCacheElement} />}
                    {searchResult && typeof searchResult === 'string' && <p className='result-msg'>{searchResult}</p>}
                </div>}
            </div>
        </OutsideClickDetector>
    )
}