
import FormStyles from './FormStyles'


const RadioButton = (props) =>

		(
			<>
			<input 
			type="radio" 
			id={props.id}
			onChange={props.onChange} 
			name={props.name} 
			htmlFor={props.htmlFor}
			 style={FormStyles.RadioButton}>

			</input>

			<label style={FormStyles.radioButton}>{props.label}</label>
			</>
		)
			
	


export default RadioButton