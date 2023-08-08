//input group
// import Styles from './InputGroup.module.css'

function InputGroup({ label, placeholder, type, name, handleChange, value }){
    return(
        <div className='mb-3 input-group'>
            <label className='input-group-text'>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className='form-control'
                name={name}
                //sempre que se lida com um evento utiliza-se o nome handle
                onChange={handleChange}
                defaultValue={value}
            />
        </div>
    )
}

export default InputGroup
