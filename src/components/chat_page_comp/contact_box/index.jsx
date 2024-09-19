import './style.scss'

export default function ContactBox({ /*openChat,*/ contact_id, profile_img, bg_color, display_name, last_message, last_message_time, unread_count, status}) {
    
    function formatTime(time) {
        const currentTime = new Date();
        const messageTime = new Date(time);

        const isSameYear = currentTime.getFullYear() === messageTime.getFullYear();
        const isSameMonth = currentTime.getMonth() === messageTime.getMonth();
        const isSameDay = currentTime.getDate() === messageTime.getDate();

        if ( isSameYear && isSameMonth && isSameDay ) {
            const hours = messageTime.getHours();
            const minutes = messageTime.getMinutes();

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;

        } 
        else if (isSameYear && isSameMonth) {
            if ( currentTime.getDate() - messageTime.getDate() === 1 ) {
                return 'Yesterday';
            }
            else if ( currentTime.getDate() - messageTime.getDate() <= 6 ) {
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
        <div className="contact no-select" onClick={() => openChat(contact_id)}>
            <div className="contact-image" style={{ backgroundColor: bg_color }}>
                {profile_img ? 
                    <img src="https://picsum.photos/200/300" />
                        :
                    <h2>{display_name[0]}</h2>
                }
                <div className={`status ${status ? "online" : "offline"}`}></div>
            </div>
            <div className="contact-info">
                <h5 className="contact-name">{display_name}</h5>
                <p className="last-message">{last_message}</p>
            </div>
            <div className='container'>
                <p className="last-message-time">{formatTime(last_message_time)}</p>
                { unread_count > 0 && <span className="unread-count">{unread_count}</span>}
            </div>
        </div>
    )
}