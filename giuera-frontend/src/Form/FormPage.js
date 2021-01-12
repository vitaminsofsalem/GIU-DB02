import React from 'react'
import FormStyles from './FormStyles'
import InputBox from './InputBox'


class FormPage extends React.Component{

	constructor(props){
		super(props)
	}


	render(){
		return (
			<>
			<div style={FormStyles.bg}>
				<h1 className="mainPageTitle" style={FormStyles.header}>{this.props.header}</h1>

				<form style={FormStyles.form}>
					{this.props.children}
				</form>

			</div>
			</>
		)
	}
}
export default FormPage