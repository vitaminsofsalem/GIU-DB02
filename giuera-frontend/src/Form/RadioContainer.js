
import FormStyles from './FormStyles'


const RadioContainer = (props) =>

		(
			
			
		<div style={FormStyles.infoBox}>

			<label> {props.label} </label>

			<div style={FormStyles.radioContainer}>
					{props.children}
			</div>

		</div>

		)
			
	


export default RadioContainer