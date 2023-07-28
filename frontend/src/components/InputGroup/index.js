//input group
import Styles from './InputGroup.module.css'

function InputGroup({ label, placeholder, type }){
    return(
        <div className='mb-3 input-group'>
            <label className='input-group-text'>{label}</label>
            <input type={type} placeholder={placeholder} className='form-control'/>
        </div>
    )
}

export default InputGroup