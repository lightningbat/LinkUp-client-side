import './style.scss';

import { useState } from 'react';
import FetchService from '../../../../services/fetchService';
import { getToken } from '../../../../services/authenticationService';
import { Spinner } from '../../../../custom/loading_animations';
import useCustomDialog from '../../../../custom/dialogs';

export default function ContactBoxToBeAdded({ user_data, delCacheElement }) {

    /*
    0: initial state
    1: request sent (loading)
    2: request successful
    */
    const [requestStatus, setRequestStatus] = useState(0);

    const customDialogs = useCustomDialog();
    const addContact = async () => {
        setRequestStatus(1);
        const res = await FetchService('addContact', { token: getToken(), contact_user_id: user_data.user_id });
        if (res.ok) {
            setRequestStatus(2);
            delCacheElement(user_data.user_id);
        } else {
            setRequestStatus(0);
            let message = res.responseType == 'json' ? res.responseData.message : res.responseData;
            await customDialogs.alert({
                type: 'alert',
                description: message,
            });
        }
    }

    return (
        <div className="contact-box-to-be-added">
            <div className='left-right'>
                <div className="profile-icon" style={{ backgroundColor: user_data.bg_color }}>
                    {user_data.profile_img ?
                        <img src={user_data.profile_img} alt="" />
                        :
                        <h3>{user_data.display_name.charAt(0)}</h3>
                    }
                </div>
                <div className="account-info">
                    <h3>{user_data.display_name}</h3>
                    <p>{user_data.username}</p>
                </div>
            </div>
            {requestStatus === 0 && <div className="btn-add-contact" onClick={addContact}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
            </div>}
            {requestStatus === 1 && <Spinner scale={0.7} />}
            {requestStatus === 2 &&
                <div className="saved-status-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    </svg>
                </div>}
        </div>
    )
}