import React, { useEffect } from "react";
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
			instructorAddingAssignment: false,
			popUpMsg: "",
			popUpVisible: 0,
			coursePopupVisible: 0,
			popupCourse: {},
			studentAssignments: [],
			studentFeedback: [],
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
			newAssignment: {
				number: 0,
				type: "",
				fullGrade: 0,
				weight: 0,
				deadline: "",
				content: "",
			},
			issueCert: {
				id: 0,
			},
			user: {},
			courses: [],
		};

		this.instructorCourseDetailsFuncs = {
			toggleAddAssignment: () => {
				this.setState({
					instructorAddingAssignment: !this.state.instructorAddingAssignment,
				});
			},
			onStudentIssueCertChange: (event) => {
				console.log(this.state);
				this.setState({
					issueCert: {
						id: event.target.value,
					},
				});
			},
			onNumberChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.number = event.target.value;
				});
			},
			onTypeChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.type = event.target.value;
				});
			},
			onFullGradeChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.fullGrade = event.target.value;
				});
			},
			onWeightChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.weight = event.target.value;
				});
			},
			onDeadlineChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.deadline = event.target.value;
				});
			},
			onContentChanged: (event) => {
				console.log(this.state);
				this.setState(() => {
					this.state.newAssignment.content = event.target.value;
				});
			},
			addAssignment: async (cid) => {
				if (!this.state.newAssignment.number > 0) {
					this.setState({
						popUpMsg: "Invalid input at number, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (!this.state.newAssignment.fullGrade > 0) {
					this.setState({
						popUpMsg: "Invalid input at full grade, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (!this.state.newAssignment.weight > 0) {
					this.setState({
						popUpMsg: "Invalid input at weight, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (this.state.newAssignment.type.trim() === "") {
					this.setState({
						popUpMsg: "Type cannot be empty, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (this.state.newAssignment.content.trim() === "") {
					this.setState({
						popUpMsg: "Content cannot be empty, please fix",
						popUpVisible: 1,
					});
					return;
				}
				if (this.state.newAssignment.deadline.trim() === "") {
					this.setState({
						popUpMsg: "Deadline cannot be empty, please fix",
						popUpVisible: 1,
					});
					return;
				}
				this.instructorCourseDetailsFuncs.toggleAddAssignment();
				const data = {
					instructorid: this.props.user.id,
					courseid: cid,
					number: this.state.newAssignment.number,
					type: this.state.newAssignment.type,
					fullGrade: this.state.newAssignment.fullGrade,
					weight: this.state.newAssignment.weight,
					deadline: this.state.newAssignment.deadline,
					content: this.state.newAssignment.content,
				};
				console.log(data);

				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				};

				let response = await fetch(
					"http://localhost:3001/defineassignment",
					request
				);
			},
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

	fetchStudentAssignments = async (cid) => {
		const sub = {
			instructorid: this.props.user.id,
			courseid: cid,
		};

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch(
			"http://localhost:3001/viewstudentassignments",
			request
		);
		let data = await response.json();

		this.setState({
			studentAssignments: data.data,
		});
	};

	fetchStudentFeedback = async (cid) => {
		const sub = {
			instructorid: this.props.user.id,
			courseid: cid,
		};

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch(
			"http://localhost:3001/viewstudentfeedback",
			request
		);
		let data = await response.json();

		this.setState({
			studentFeedback: data.data,
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
				<Button
					onClick={() => {
						this.fetchStudentAssignments(course.cid || course.id);
						this.fetchStudentFeedback(course.cid || course.id);
						this.setState({ coursePopup: course, coursePopupVisible: true });
					}}
				>
					view
				</Button>
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
			<>
				<Button onClick={this.instructorAddCourseFuncs.toggleAddCourse}>
					add
				</Button>
				<Scrollable>{this.viewCourses()}</Scrollable>
			</>
		);
	};

	coursePopupGeneral = (course) => {
		return (
			<>
				<h1>{course.name}</h1>
				<h2>ID: {course.id || course.cid}</h2>
				<h2>Credit Hours: {course.creditHours}</h2>
				{this.props.user.type === 1 ? (
					<>
						<Button
							onClick={this.instructorCourseDetailsFuncs.toggleAddAssignment}
						>
							add assignment
						</Button>
						<h2>Assignments by students</h2>
						{this.state.studentAssignments.map((val) => {
							return (
								<>
									<h3>Assignment by: {val.sid}</h3>
									<InputBox
										label="Grade:"
										type="number"
										onChange={(e) => {
											const list = this.state.studentAssignments;
											list[list.indexOf(val)].grade = e.target.value;
										}}
									/>
									<div>
										<Button
											onClick={async () => {
												const list = this.state.studentAssignments;
												if (list[list.indexOf(val)].grade > 0) {
													const data = {
														instructorid: this.props.user.id,
														courseid: course.id || course.cid,
														studentid: val.sid,
														assignment_number: val.assignmentNumber,
														type: val.assignmentType,
														grade: list[list.indexOf(val)].grade,
													};
													const request = {
														method: "POST",
														headers: { "Content-Type": "application/json" },
														body: JSON.stringify(data),
													};
													console.log(data);

													let response = await fetch(
														"http://localhost:3001/gradeassignment",
														request
													);
												} else {
													this.setState({
														popUpMsg: "Enter valid grade to grade student",
														popUpVisible: 1,
													});
												}
											}}
										>
											submit grade
										</Button>
									</div>
								</>
							);
						})}
						<h2>Feedback by students</h2>
						{this.state.studentFeedback.map((val) => {
							return (
								<h3>
									Feedback no: {val.number}/ comment: {val.comment}/ likes:
									{val.numberOfLikes}
								</h3>
							);
						})}
						<InputBox
							label="Issue certificate to student id:"
							type="number"
							value={this.state.issueCert.id}
							onChange={
								this.instructorCourseDetailsFuncs.onStudentIssueCertChange
							}
						/>
						<div style={{ marginTop: 30, marginLeft: 50 }}>
							<Button
								onClick={async () => {
									if (this.state.issueCert.id > 0) {
										const today = new Date();
										const dd = String(today.getDate()).padStart(2, "0");
										const mm = String(today.getMonth() + 1).padStart(2, "0");
										const yyyy = today.getFullYear();
										const data = {
											instructorid: this.props.user.id,
											courseid: course.id || course.cid,
											studentid: this.state.issueCert.id,
											issueDate: yyyy + "-" + dd + "-" + mm,
										};
										const request = {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify(data),
										};

										let response = await fetch(
											"http://localhost:3001/issuecertificate",
											request
										);
										this.setState({
											issueCert: {
												id: 0,
											},
										});
									} else {
										this.setState({
											popUpMsg: "Enter valid id to issue certificate to",
											popUpVisible: 1,
										});
									}
								}}
							>
								issue certificate
							</Button>
						</div>
					</>
				) : (
					<h2>IMPLEMENT HERE COURSE DETAILS STUFF FOR STUDNET</h2>
				)}
			</>
		);
	};

	coursePopupAddAssign = (cid) => {
		return (
			<Scrollable>
				<InputBox
					label="Assignment Number"
					type="number"
					onChange={this.instructorCourseDetailsFuncs.onNumberChanged}
				/>
				<InputBox
					label="Assignment Type"
					type="text"
					onChange={this.instructorCourseDetailsFuncs.onTypeChanged}
				/>
				<InputBox
					label="Full Grade"
					type="number"
					onChange={this.instructorCourseDetailsFuncs.onFullGradeChanged}
				/>
				<InputBox
					label="Weight"
					type="number"
					onChange={this.instructorCourseDetailsFuncs.onWeightChanged}
				/>
				<InputBox
					label="Deadline"
					type="text"
					onChange={this.instructorCourseDetailsFuncs.onDeadlineChanged}
				/>
				<InputBox
					label="Content"
					type="text"
					onChange={this.instructorCourseDetailsFuncs.onContentChanged}
				/>

				<Button
					onClick={() => {
						this.instructorCourseDetailsFuncs.addAssignment(cid);
					}}
				>
					save
				</Button>
				<Button onClick={this.instructorCourseDetailsFuncs.toggleAddAssignment}>
					cancel
				</Button>
			</Scrollable>
		);
	};

	coursePopup = () => {
		const course = this.state.coursePopup;
		if (course === undefined) {
			return <></>;
		}
		return (
			<Scrollable>
				{this.state.instructorAddingAssignment
					? this.coursePopupAddAssign(course.id || course.cid)
					: this.coursePopupGeneral(course)}
			</Scrollable>
		);
	};

	instructorDashboard = () => {
		return (
			<div style={DashboardStyles.bg}>
				<h1 style={{ color: "white" }}>Welcome, {this.state.user.firstName}</h1>
				<CardsContainer>
					<Win toggle={this.state.coursePopupVisible}>
						{this.coursePopup()}
						<Button onClick={() => this.setState({ coursePopupVisible: 0 })}>
							dimiss
						</Button>
					</Win>
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
				</CardsContainer>
			</div>
		);
	};

	studentDashboard = () => {
		return (
			<div style={DashboardStyles.bg}>
				<h1 style={{ color: "white" }}>Welcome, {this.state.user.firstName}</h1>
				<CardsContainer>
					<Win toggle={this.state.coursePopupVisible}>
						{this.coursePopup()}
						<Button onClick={() => this.setState({ coursePopupVisible: 0 })}>
							dimiss
						</Button>
					</Win>
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
