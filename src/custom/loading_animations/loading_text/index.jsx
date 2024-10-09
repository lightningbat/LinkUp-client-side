import './style.scss'

/**
 * 
 * @param {string} text - text to display, default is 'Loading'
 * @param {number} scale - scale of the text, default is 1
 * @param {object} otherStyles - other styles to apply, eg {color: 'red', ...} 
 * @returns {JSX.Element}
 */
export default function LoadingText({text, scale = 1, otherStyles}) {
    if (scale <= 0 ) scale = 1
    const defaultScale = 20 * scale
    return (
        <div className="loading-text" style={{fontSize: `${defaultScale}px`, ...otherStyles}}>
            {text || 'Loading'}
            <span className="dots"/>
        </div>
    )
}