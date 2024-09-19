import './style.scss'

export default function BouncingDots({scale = 1, color = 'var(--primary-text-color)', speed = 1}) {
    if (scale <= 0 ) scale = 1
    if (speed <= 0) speed = 1
    if (!color || color === '') color = 'var(--primary-text-color)'

    const defaultScale = 10 * scale
    const animation_duration = 0.5 / speed
    return (
        <div className="loading-animation bouncing-dots" style={{fontSize: `${defaultScale}px`}}>
            <div style={{backgroundColor: color, animationDuration: `${animation_duration}s`}}></div>
            <div style={{backgroundColor: color, animationDuration: `${animation_duration}s`, animationDelay: `${animation_duration * 20 / 100}s`}}></div>
            <div style={{backgroundColor: color, animationDuration: `${animation_duration}s`, animationDelay: `${animation_duration * 40 / 100}s`}}></div>
        </div>
    )
}