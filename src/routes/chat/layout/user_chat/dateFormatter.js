/**
 * @param {Date} date - date to be formatted
 * @param {boolean} onlyDay - if true, return only the date without time
 * @param {boolean} onlyTime - if true, return only the time without date
 * @returns {string} formatted date
 */
export default function dateFormatter(date, onlyDay = false, onlyTime = false) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentTime = new Date();
    const timestamp = new Date(date);

    const isSameYear = currentTime.getFullYear() === timestamp.getFullYear();
    const isSameMonth = currentTime.getMonth() === timestamp.getMonth();
    const isSameDay = currentTime.getDate() === timestamp.getDate();

    const isYesterday = () => {
        const timestamp_clone = new Date(date);
        // creating new date for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        // resetting the time to midnight for comparison
        yesterday.setHours(0, 0, 0, 0);
        timestamp_clone.setHours(0, 0, 0, 0);

        return yesterday.getTime() === timestamp_clone.getTime();
    }

    let formattedDate = '';
    if (isYesterday()) {
        formattedDate = 'Yesterday';
    } else if (isSameYear && isSameMonth && isSameDay) {
        formattedDate = 'Today';
    } else if (isSameYear) {
        formattedDate = `${timestamp.getDate()} ${months[timestamp.getMonth()]}`;
    } else {
        formattedDate = `${timestamp.getDate()} ${months[timestamp.getMonth()]} ${timestamp.getFullYear()}`;
    }

    if (onlyDay) {
        return formattedDate;
    }

    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    if (onlyTime) {
        return strTime;
    }
    return formattedDate + ' ' + strTime;
}