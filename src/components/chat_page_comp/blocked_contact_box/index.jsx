import './style.scss'

export default function BlockedContactBox({contact_id, display_name, username, profile_pic, bg_color, showUnblockPopup}) {
    return (
        <div className="blocked-contact-box no-select">
            <div className="profile-icon" style={{backgroundColor: bg_color}}>
                {profile_pic ?
                    <img src={profile_pic} alt="" />
                    :
                    <h3>{ display_name.charAt(0).toUpperCase() }</h3>
                }
            </div>
            <div className="account_info">
                <h3>{display_name}</h3>
                <p>{username}</p>
            </div>
            <div className="btn-unblock" onClick={() => showUnblockPopup(contact_id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                </svg>
            </div>
        </div>
    )
}