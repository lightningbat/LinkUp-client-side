import './style.scss';

/**
 * 
 * @param {number} scale - scale of the spinner (default is 50px) 
 * @param {number} stroke_width - stroke width of the spinner (default is 5)
 * @param {string} color - color of the spinner (default is 'var(--primary-text-color)')
 * @param {number} speed - speed of the spinner (default is 1)
 * 
 * @returns {JSX.Element}
 */
export default function Spinner({scale = 1, stroke_width = 5, color = 'var(--primary-text-color)', speed = 1}) {
    if (scale <= 0 ) scale = 1
    if (speed <= 0) speed = 1
    if (!color || color === '') color = 'var(--primary-text-color)'

    const defaultScale = 50 * scale
    const animationDuration = 1.5 / speed

    return (
        <svg className="loading-animation spinner" viewBox="0 0 50 50" style={{height: `${defaultScale}px`, width: `${defaultScale}px`}}>
            <circle className="path" cx="25" cy="25" r="20" fill="none" stroke={color} style={{animationDuration: `${animationDuration}s`}} strokeWidth={stroke_width}></circle>
        </svg>
    )
}