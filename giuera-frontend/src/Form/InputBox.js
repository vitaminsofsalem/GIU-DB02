import FormStyles from "./FormStyles";

const InputBox = (props) => (
	<>
		<div style={FormStyles.infoBox}>
			<label>{props.label}</label>

			<input
				id={props.id}
				htmlFor={props.htmlFor}
				style={FormStyles.inputField}
				type={props.type}
				onChange={props.onChange}
				value={props.value}
			></input>
		</div>
	</>
);

export default InputBox;
