
import React from 'react'
import FormPage from './Form/FormPage'
import InputBox from './Form/InputBox'


class RegisterPage extends React.Component{

	constructor(props){
		super(props)
	}


	render(){
		return (
			<FormPage header="register">
				<InputBox label="first name" type="text"/>
				<InputBox label="last name" type="text"/>
				<InputBox label="email" type="text"/>
				<InputBox label="username" type="text"/>
				<InputBox label="password" type="password"/>
			</FormPage>
		)
	}
}
export default RegisterPage