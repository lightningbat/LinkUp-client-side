import PropTypes from 'prop-types';
import './style.scss';

GroupsTab.propTypes = {
    show: PropTypes.bool
}
export default function GroupsTab({ show }) {
    return (
        <div className="groups-tab" style={{ display: show ? "flex" : "none" }}>
            Coming Soon...
        </div>
    )
}