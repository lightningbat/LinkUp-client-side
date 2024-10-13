import './style.scss'
import PropTypes from 'prop-types';

const datePropType = (props, propName, componentName) => {
    if (!(props[propName] instanceof Date)) {
        return new Error(
            `${propName} in ${componentName} is not a valid Date object.`
        );
    }
    return null;
};

ContactBox.propTypes = {
    /*openChat: PropTypes.func.isRequired,*/
    user_id: PropTypes.string.isRequired,
    profile_img: PropTypes.string,
    bgColor: PropTypes.string.isRequired,
    display_name: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
    last_message_info: PropTypes.shape({
        message: PropTypes.string,
        message_type: PropTypes.number, // 0: text, 1: image
        time: datePropType,
        unread_count: PropTypes.number
    })
}
export default function ContactBox({ /*openChat,*/ user_id, profile_img, bgColor, display_name, online, last_message_info }) {

    const toShowLastMessageInfo = last_message_info && last_message_info.time;

    // formats date into human readable format
    function formatTime(time) {
        const currentTime = new Date();
        const messageTime = new Date(time);

        const isSameYear = currentTime.getFullYear() === messageTime.getFullYear();
        const isSameMonth = currentTime.getMonth() === messageTime.getMonth();
        const isSameDay = currentTime.getDate() === messageTime.getDate();

        if (isSameYear && isSameMonth && isSameDay) {
            const hours = messageTime.getHours();
            const minutes = messageTime.getMinutes();

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;

        }
        else if (isSameYear && isSameMonth) {
            if (currentTime.getDate() - messageTime.getDate() === 1) {
                return 'Yesterday';
            }
            else if (currentTime.getDate() - messageTime.getDate() <= 6) {
                return messageTime.toLocaleString('default', { weekday: 'long' });
            }
            return `${messageTime.getDate()} ${messageTime.toLocaleString('default', { month: 'short' })}`;
        }
        else if (isSameYear) {
            return `${messageTime.toLocaleString('default', { month: 'short' })} ${messageTime.getDate()}`;
        }
        else {
            return `${messageTime.getDate()} ${messageTime.toLocaleString('default', { month: 'short' })} ${messageTime.getFullYear()}`;
        }
    }

    return (
        <div className="contact no-select">
            <div className="contact-image" style={{ backgroundColor: bgColor }}>
                {profile_img ?
                    <img src={profile_img} alt="" />
                    :
                    <h2>{display_name[0]}</h2>
                }
                <div className={`status ${online ? "online" : "offline"}`}></div>
            </div>
            <div className="contact-info">
                <h5 className="contact-name">{display_name}</h5>
                {toShowLastMessageInfo &&
                    <p className='last-message'>
                        {last_message_info?.message_type === 1 ?
                            <span className='type-text'>{last_message_info?.message}</span>
                                :
                            <span className='type-image'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-images" viewBox="0 0 16 16">
                                    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                                    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z" />
                                </svg>
                                Image
                            </span>
                        }
                    </p>
                }
            </div>
            {toShowLastMessageInfo && <div className='container'>
                <p className="last-message-time">{formatTime(last_message_info?.time)}</p>
                {last_message_info?.unread_count > 0 && <span className="unread-count">{last_message_info?.unread_count}</span>}
            </div>}
        </div>
    )
}