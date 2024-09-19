import './style.scss'

export default function SubmitButton({ title }) {
    return (
        <div className='form-control__authentication'>
            <button type="submit">{title}</button>
        </div>
    )
}