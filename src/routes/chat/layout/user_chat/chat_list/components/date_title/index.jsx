import './style.scss'
import dateFormatter from '../../../dateFormatter'

// eslint-disable-next-line react/prop-types
export default function DateTitle({date}) {
    return (
        <div className="date-title">
            <span className="title">{dateFormatter(date, true)}</span>
        </div>
    )
}