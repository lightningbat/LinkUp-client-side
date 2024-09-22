import './style.scss'

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