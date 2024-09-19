import './style.scss'

export default function ToggleSwitch({defaultChecked, onChange}) {
    return (
        <div className="toggle-switch">
            <label className="switch">
                <input type="checkbox" checked={defaultChecked} onChange={e => onChange(e.target.checked)} />
                <span className="slider round"></span>
            </label>
        </div>
    )
}