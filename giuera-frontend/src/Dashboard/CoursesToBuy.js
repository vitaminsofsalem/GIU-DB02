import React from 'react'
import Card from "./Card";
import Button from "./Button";
import InfoBox from "./InfoBox";
import Scrollable from "./Scrollable";
import InputBox from "./../Form/InputBox";
import RadioContainer from "./../Form/RadioContainer";
import RadioButton from "./../Form/RadioButton";


class CoursesToBuy extends React.Component{
	constructor(props){
		super(props)

		this.state={
			user:null,
			newEnroll:{},
			coursesToBuy:null,
		}


	}

	fetchCoursesToBuy = async () => {
		let response = await fetch("http://localhost:3001/availablecourses");
		let data = await response.json();
		let existingCourseIDs = this.props.getEnrolled().map((course) => course.id);
		let ctb = data.recordset.filter(
				(course) => !existingCourseIDs.includes(course.id)
			)
		this.setState({
			coursesToBuy: ctb,
		})

	}

	
	componentDidMount = () => {
		this.fetchCoursesToBuy();
		this.setState({
			user:this.props.user,
		})

	}

	enrollInCourse  = async (course) =>{

		this.setState({coursesToBuy:null,enrolled:null})

		let sub = {
			courseid : course.id,
			studentid : this.state.user.id,
			instructorid : course.instructorId
		}

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch("http://localhost:3001/enrollincourse",request);

		let data = await response.json()

		this.fetchCoursesToBuy();
		this.props.fetchStudentCourses();
		course.enrollResult = data.msg;



	}

	viewCoursesToBuy = () => {
		console.log(this.state.coursesToBuy);
		return this.state.coursesToBuy.map((course) => (
			<InfoBox
				key={course.id}
				header={course.name}
				sub={"credit hours:" + course.creditHours}
			>
				<p>{course.courseDescription}</p>
				<Button onClick={()=>{
					this.enrollInCourse(course)								
				}}>enroll</Button>
			</InfoBox>
		));
	};

	render=()=>{
		if ( this.state.user==null || this.state.coursesToBuy==null){
			return <h1>loading</h1>
		}

		
		return(
		<Scrollable>
			{this.viewCoursesToBuy()}
		</Scrollable>
		)
	}
}


export default CoursesToBuy