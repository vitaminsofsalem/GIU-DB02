import React from "react";
import FormPage from "./Form/FormPage";
import InputBox from "./Form/InputBox";
import RadioContainer from "./Form/RadioContainer";
import RadioButton from "./Form/RadioButton";

import { Link } from "react-router-dom";

class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			gender: "u",
			address: "",
			password: "",
			signUpAs: "u",
			registerSucceeded: "",
			msg: "",
		};
	}

	sendSubmission = async (sub) => {
		//send sign in submission to backend

		const request = {
			//creating request
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub), //storing submission into the body of the request
		};

		let response = await fetch("http://localhost:3001/userregister", request); //sends to the backend, then waits for response
		let data = await response.json(); //convert JSON to javascript object after receiving the response

		this.setState({
			registerSucceeded: data.registerSucceeded, //update state using received object from backend
			msg: data.msg,
		});
	};

	onFirstNameChange = (event) => {
		this.setState({ firstName: event.target.value });
	};

	onLastNameChange = (event) => {
		this.setState({ lastName: event.target.value });
	};

	onEmailChange = (event) => {
		this.setState({ email: event.target.value });
	};

	onPasswordChange = (event) => {
		this.setState({ password: event.target.value });
	};

	onAddressChange = (event) => {
		this.setState({ address: event.target.value });
	};

	onSelectMale = (event) => {
		this.setState({ gender: 0 });
	};

	onSelectFemale = (event) => {
		this.setState({ gender: 1 });
	};

	onSelectAsStudent = (event) => {
		this.setState({ signUpAs: "student" });
	};

	onSelectAsInstructor = (event) => {
		this.setState({ signUpAs: "instructor" });
	};

	registerResultMsg = () => {
		if (this.state.registerSucceeded === "0") {
			return <h1 style={{ color: "tomato" }}>ERROR : {this.state.msg}</h1>;
		} else if (this.state.registerSucceeded === "1") {
			return <h1 style={{ color: "palegreen" }}>SUCCESS : {this.state.msg}</h1>;
		}
	};
	onSubmit = (e) => {
		e.preventDefault();

		let submission = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			signUpAs: this.state.signUpAs,
			email: this.state.email,
			gender: this.state.gender,
			address: this.state.address,
			password: this.state.password,
		};

		this.sendSubmission(submission);
	};

	render() {
		return (
			<>
				<FormPage header="register">
					{this.registerResultMsg()}
					<InputBox
						label="first name"
						type="text"
						onChange={this.onFirstNameChange}
					/>
					<InputBox
						label="last name"
						type="text"
						onChange={this.onLastNameChange}
					/>
					<InputBox label="email" type="text" onChange={this.onEmailChange} />

					<RadioContainer label="gender">
						<RadioButton
							label="male"
							name="gender"
							onChange={this.onSelectMale}
						></RadioButton>
						<RadioButton
							label="female"
							name="gender"
							onChange={this.onSelectFemale}
						></RadioButton>
					</RadioContainer>

					<RadioContainer label="register as">
						<RadioButton
							label="student"
							name="profession"
							onChange={this.onSelectAsStudent}
						></RadioButton>
						<RadioButton
							label="instructor"
							name="profession"
							onChange={this.onSelectAsInstructor}
						></RadioButton>
					</RadioContainer>

					<InputBox
						label="Address"
						type="text"
						onChange={this.onAddressChange}
					/>
					<InputBox
						label="password"
						type="password"
						onChange={this.onPasswordChange}
					/>
					<button onClick={this.onSubmit}>sign up</button>
					<Link to="/">
						<button>back</button>
					</Link>
				</FormPage>
			</>
		);
	}
}
export default RegisterPage;
