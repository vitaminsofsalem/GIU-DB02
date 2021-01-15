import React from "react";
import CardsContainer from "./CardsContainer";
import DashboardStyles from "./DashboardStyles";
import Card from "./Card";
import Button from "./Button";
import InfoBox from "./InfoBox";
import Scrollable from "./Scrollable";
import InputBox from "./../Form/InputBox";
import RadioContainer from "./../Form/RadioContainer";
import RadioButton from "./../Form/RadioButton";
import Win from "./Win";
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profileEditFlag: 0,
			coursesToBuy: [],
			instructorAddingCourse: false,
			popUpMsg: "",
			popUpVisible: 0,
			newProfile: {
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				address: "",
				gender: "",
			},
			newCourse: {
				name: "",
				description: "",
				creditHours: 0,
				price: 0.0,
			},

			user: {},
			courses: [],
		};

		this.instructorAddCourseFuncs = {
			toggleAddCourse: () => {
				this.setState({
					instructorAddingCourse: !this.state.instructorAddingCourse,
				});
			},

			onNameChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newCourse.name = event.target.value;
				});
			},
			onDescChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newCourse.description = event.target.value;
				});
			},

			onCreditHoursChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newCourse.creditHours = event.target.value;
				});
			},

			onPriceChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newCourse.price = event.target.value;
				});
			},

			addCourse: async () => {
				if (!this.state.newCourse.creditHours > 0) {
					this.setState({
						popUpMsg: "Invalid input at credit hours, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (!this.state.newCourse.price > 0) {
					this.setState({
						popUpMsg: "Invalid input at price, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (this.state.newCourse.name.trim() === "") {
					this.setState({
						popUpMsg: "Name cannot be empty, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (this.state.newCourse.description.trim() === "") {
					this.setState({
						popUpMsg: "Description cannot be empty, please fix",
						popUpVisible: 1,
					});
					return;
				}
				this.instructorAddCourseFuncs.toggleAddCourse();
				const data = {
					credit_hours: this.state.newCourse.creditHours,
					instructorid: this.props.user.id,
					description: this.state.newCourse.description,
					price: this.state.newCourse.price,
					name: this.state.newCourse.name,
				};

				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				};

				console.log(JSON.stringify(data));
				let response = await fetch("http://localhost:3001/addcourse", request);
				this.fetchInstructorCourses();
			},
		};

		this.profileEditFuncs = {
			onFirstNameChange: (event) => {
				console.log(this.state);
				this.setState({
					newProfile: {
						...this.state.newProfile,
						firstName: event.target.value,
					},
				});
			},

			onLastNameChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						lastName: event.target.value,
					},
				});
			},

			onEmailChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						email: event.target.value,
					},
				});
			},

			onPasswordChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						password: event.target.value,
					},
				});
			},

			onAddressChange: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						address: event.target.value,
					},
				});
			},

			onSelectMale: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						gender: 1,
					},
				});
			},

			onSelectFemale: (event) => {
				this.setState({
					newProfile: {
						...this.state.newProfile,
						gender: 0,
					},
				});
			},
			changeProfile: async () => {
				this.profileEditFuncs.toggleProfileEdit();
				const sub = {
					userid: this.props.user.id,
					...this.state.newProfile,
				};

				console.log(sub);

				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(sub),
				};

				let response = await fetch(
					"http://localhost:3001/editprofile",
					request
				);
				//let data = await response.json();
				this.loadProfile();
			},

			toggleProfileEdit: () => {
				console.log(this.state.profileEditFlag);

				this.setState({
					profileEditFlag: !this.state.profileEditFlag,
				});
			},
		};
	}
	fetchCoursesToBuy = async () => {
		let response = await fetch("http://localhost:3001/availablecourses");
		let data = await response.json();
		let existingCourseIDs = this.state.courses.map((course) => course.id);

		this.setState({
			coursesToBuy: data.recordset.filter(
				(course) => !existingCourseIDs.includes(course.id)
			),
		});
	};

	fetchStudentCourses = async () => {
		const sub = {
			studentid: this.props.user.id,
		};

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch("http://localhost:3001/viewenrolled", request);
		let data = await response.json();

		this.setState({
			courses: data.courses,
		});
	};

	fetchInstructorCourses = async () => {
		const data = {
			instructorid: this.props.user.id,
		};
		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		};

		console.log(JSON.stringify(data));
		let response = await fetch(
			"http://localhost:3001/viewacceptedcourses",
			request
		);
		const resData = await response.json();

		this.setState({
			courses: resData.data,
		});
	};

	loadProfile = async () => {
		if (this.props.user.type === 1) {
			this.fetchInstructorCourses();
			const sub = {
				instructorid: this.props.user.id,
			};

			const request = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(sub),
			};

			let response = await fetch(
				"http://localhost:3001/instructorprofile",
				request
			);
			let data = await response.json();
			console.log();
			this.setState({
				flag: "",
				user: {
					id: this.props.user.id,
					firstName: data.firstName,
					lastName: data.lastName,
					gender: data.gender,
					email: data.email,
					address: data.address,
					rating: data.rating,
				},
			});
		} else if (this.props.user.type === 2) {
			this.fetchStudentCourses();

			const sub = {
				studentid: this.props.user.id,
			};

			const request = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(sub),
			};

			let response = await fetch(
				"http://localhost:3001/studentprofile",
				request
			);
			let data = await response.json();

			this.setState({
				user: {
					id: this.props.user.id,
					gpa: data.gpa,
					firstName: data.firstName,
					lastName: data.lastName,
					gender: data.gender,
					email: data.email,
					address: data.address,
				},
			});
		}

		this.setState({
			newProfile: {
				firstName: this.state.user.firstName,
				lastName: this.state.user.lastName,
				gender: this.state.user.gender,
				email: this.state.user.email,
				address: this.state.user.address,
			},
		});
	};

	componentDidMount = async () => {
		await this.loadProfile();
		await this.fetchCoursesToBuy();
	};

	viewCourses = () => {
		return this.state.courses.map((course) => (
			<InfoBox
				key={course.cid || course.id}
				header={course.name}
				sub={"credit hours:" + course.creditHours}
			>
				<Button>view</Button>
			</InfoBox>
		));
	};

	viewCoursesToBuy = () => {
		console.log(this.state.coursesToBuy);
		return this.state.coursesToBuy.map((course) => (
			<InfoBox
				key={course.id}
				header={course.name}
				sub={"credit hours:" + course.creditHours}
			>
				<p>{course.courseDescription}</p>
				<Button>enroll</Button>
			</InfoBox>
		));
	};

	profileView = () => {
		return (
			<Scrollable>
				<Button onClick={this.profileEditFuncs.toggleProfileEdit}>edit</Button>
				<h2>{this.state.user.firstName + " " + this.state.user.lastName}</h2>
				<h2>{this.props.user.type === 2 ? "student" : "instructor"}</h2>
				<h2> ID : {this.state.user.id} </h2>
				<h2>
					{" "}
					{this.props.user.type === 2
						? "GPA : " + this.state.user.gpa
						: "rating : " + this.state.user.rating}
				</h2>
				<h2>Email: {this.state.user.email}</h2>
				<h2>Gender: {this.state.user.gender ? "Male" : "Female"}</h2>
				<h2>Address: {this.state.user.address}</h2>
			</Scrollable>
		);
	};

	profileEdit = () => {
		return (
			<Scrollable>
				<InputBox
					label="first name"
					type="text"
					value={this.state.newProfile.firstName}
					onChange={this.profileEditFuncs.onFirstNameChange}
				/>
				<InputBox
					label="last name"
					type="text"
					value={this.state.newProfile.lastName}
					onChange={this.profileEditFuncs.onLastNameChange}
				/>
				<InputBox
					label="email"
					type="text"
					value={this.state.newProfile.email}
					onChange={this.profileEditFuncs.onEmailChange}
				/>

				<Button>tel. numbers</Button>
				<RadioContainer label="gender">
					<RadioButton
						label="male"
						name="gender"
						onChange={this.profileEditFuncs.onSelectMale}
					></RadioButton>
					<RadioButton
						label="female"
						name="gender"
						onChange={this.profileEditFuncs.onSelectFemale}
					></RadioButton>
				</RadioContainer>

				<InputBox
					label="Address"
					type="text"
					value={this.state.newProfile.address}
					onChange={this.profileEditFuncs.onAddressChange}
				/>
				<InputBox
					label="password"
					type="password"
					onChange={this.profileEditFuncs.onPasswordChange}
				/>

				<Button onClick={this.profileEditFuncs.changeProfile}>save</Button>
				<Button onClick={this.profileEditFuncs.toggleProfileEdit}>
					cancel
				</Button>
			</Scrollable>
		);
	};

	instructorAddCourse = () => {
		return (
			<Scrollable>
				<InputBox
					label="name"
					type="text"
					onChange={this.instructorAddCourseFuncs.onNameChanged}
				/>

				<InputBox
					label="description"
					type="text"
					onChange={this.instructorAddCourseFuncs.onDescChanged}
				/>
				<InputBox
					label="credit hours"
					type="number"
					onChange={this.instructorAddCourseFuncs.onCreditHoursChanged}
				/>
				<InputBox
					label="price"
					type="number"
					onChange={this.instructorAddCourseFuncs.onPriceChanged}
				/>

				<Button onClick={this.instructorAddCourseFuncs.addCourse}>save</Button>
				<Button onClick={this.instructorAddCourseFuncs.toggleAddCourse}>
					cancel
				</Button>
			</Scrollable>
		);
	};

	instructorCourses = () => {
		return (
			<Scrollable>
				<Button onClick={this.instructorAddCourseFuncs.toggleAddCourse}>
					add
				</Button>
				{this.viewCourses()}
			</Scrollable>
		);
	};

	instructorDashboard = () => {
		return (
			<div style={DashboardStyles.bg}>
				<h1 style={{ color: "white" }}>Welcome, {this.state.user.firstName}</h1>
				<CardsContainer>
					<Win toggle={this.state.popUpVisible}>
						{this.state.popUpMsg}
						<Button onClick={() => this.setState({ popUpVisible: 0 })}>
							dimiss
						</Button>
					</Win>
					<Card header="my courses">
						{this.state.instructorAddingCourse
							? this.instructorAddCourse()
							: this.instructorCourses()}
					</Card>

					<Card header="profile">
						{this.state.profileEditFlag
							? this.profileEdit()
							: this.profileView()}
					</Card>

					<Card header="payment settings"></Card>
				</CardsContainer>
			</div>
		);
	};

	studentDashboard = () => {
		return (
			<div style={DashboardStyles.bg}>
				<h1 style={{ color: "white" }}>Welcome, {this.state.user.firstName}</h1>
				<CardsContainer>
					<Win toggle={this.state.popUpVisible}>
						{this.state.popUpMsg}
						<Button onClick={() => this.setState({ popUpVisible: 0 })}>
							dimiss
						</Button>
					</Win>
					<Card header="my courses">
						<Scrollable>{this.viewCourses()}</Scrollable>
					</Card>

					<Card header="profile">
						{this.state.profileEditFlag
							? this.profileEdit()
							: this.profileView()}
					</Card>

					<Card header="assignments">
						<h1>hello world</h1>
						ay 7aga
					</Card>

					<Card header="available courses to buy">
						<Scrollable>{this.viewCoursesToBuy()}</Scrollable>
					</Card>
				</CardsContainer>
			</div>
		);
	};

	render() {
		if (this.props.user.type === 1) {
			return this.instructorDashboard();
		}

		return this.studentDashboard();
	}
}

export default Dashboard;
