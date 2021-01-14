import FormStyles from './FormStyles'


const InputBox = (props) =>

		(
			<>

					<div style={formstyles.infobox}>
						<label>{props.label}</label>
						
						<input
						 id={props.id}
						 htmlFor={props.htmlFor}
						 style={FormStyles.inputField}
						 type={props.type}
						 onChange={props.onChange}>

						 </input>						

					</div>

			</>
		)
			
	


export default InputBox