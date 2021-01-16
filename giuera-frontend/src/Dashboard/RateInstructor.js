import React from 'react'
import Card from "./Card";
import Button from "./Button";
import InfoBox from "./InfoBox";
import Scrollable from "./Scrollable";
import InputBox from "../Form/InputBox";
import RadioContainer from "../Form/RadioContainer";
import RadioButton from "../Form/RadioButton";


class RateInstructor extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			rate:null,
			msg:'',
		}


	}
		submitRate = async () => {
			if (this.state.rate==null){
				this.setState({msg : 'error, please choose a value for rating'})
				return
			}


			this.setState({msg : ''}) 

			let sub = {
				iid : this.props.iid,
				sid : this.props.sid,
				rate : this.state.rate,
			}

			const request = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(sub),
			};

			let response = await fetch(
				"http://localhost:3001/rateinstructor",
				request
			);

			let data = await response.json()
			this.setState({msg:data.msg})

		}

	render=()=>{
		return(
		<>
		<h1>{this.state.msg}</h1>
		<RadioContainer>
			<RadioButton name='rate' label='1' onChange={()=>{
				this.setState({rate:1})
			}} />	
			<RadioButton name='rate' label='2' onChange={()=>{
				this.setState({rate:2})
			}} />	
			<RadioButton name='rate' label='3' onChange={()=>{
				this.setState({rate:3})
			}} />	
			<RadioButton name='rate' label='4' onChange={()=>{
				this.setState({rate:4})
			}} />	
			<RadioButton name='rate' label='5' onChange={()=>{
				this.setState({rate:5})
			}} />	

		</RadioContainer>
		<Button onClick={()=>(
			this.submitRate()
		)}>rate</Button>
		</>

		)
	}
}


export default RateInstructor