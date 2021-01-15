import FormStyles from "./FormStyles";

const InputBox = (props) => (
	<>
		<div style={{...FormStyles.infoBox, ...props.styles}}>
			<label>{props.label}</label>
		{props.multiline==1? (

			<textarea
				id={props.id}
				htmlFor={props.htmlFor}
				style={{...FormStyles.inputField,...props.txtStyles}}
				type={props.type}
				onChange={props.onChange}
				value={props.value}
			></textarea>

		) : (

			<input
				id={props.id}
				htmlFor={props.htmlFor}
				style={{...FormStyles.inputField,...props.txtStyles}}
				type={props.type}
				onChange={props.onChange}
				value={props.value}
			></input>
		)}

		</div>
	</>
);

export default InputBox;
