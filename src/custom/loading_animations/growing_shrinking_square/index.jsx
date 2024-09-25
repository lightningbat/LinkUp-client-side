import './style.scss'

export default function GrowingShrinkingSquare({scale = 1, color = 'var(--primary-text-color)', speed = 1}) {
    if (scale <= 0 ) scale = 1
    if (speed <= 0) speed = 1
    if (!color || color === '') color = 'var(--primary-text-color)'

    const defaultScale = 10 * scale
    const animation_duration = 2 / speed

    return (
        <div className="loading-animation growing-shrinking-square" style={{fontSize: `${defaultScale}px`}}>
            <div style={{backgroundColor: color, animationDuration: `${animation_duration}s`}}></div>
        </div>
    )
}