import React from 'react'
import DashboardStyles from './DashboardStyles'
import InfoBox from './InfoBox'
import InputBox from './../Form/InputBox'
import Button from './Button'
import Scrollable from './Scrollable'
class Tel extends React.Component{

	
	constructor(props){
		super(props);
		this.state ={ 
			addNewMobileFlag:0,
			duplicateError:0,
			emptyError:0,
			user : this.props.user,
			mobileNumber:'',
			recordset:null,
		};
		
	}

	fetchNums= async () =>{

		const sub = {
			id : this.state.user.id,
		};

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch(
			"http://localhost:3001/viewmobile",
			request
		);

		let data = await response.json();

		this.setState({recordset : data.recordset})

	}

	addNum= async () =>{

		if (this.state.duplicateError || this.state.emptyError){
			this.setState({
				duplicateError:0,
				emptyError:0
			})
		}
	

		const sub = {
			id : this.state.user.id,
			mobileNumber : this.state.mobileNumber
		};

		if (sub.mobileNumber=='') {
			this.setState({emptyError:1})
			return;
		}

		else if (this.state.recordset.map(r=>r.mobileNumber).includes(sub.mobileNumber)) {
			this.setState({duplicateError:1})
			return;
		}


		console.log('ADD:',sub)

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub),
		};

		let response = await fetch(
			"http://localhost:3001/addmobile",
			request
		);

		
		this.fetchNums();
	}

	
	removeNum= async (num) =>{
		console.log("Ciridsu ",num)

		const request = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(num),
		};

		let response = await fetch(
			"http://localhost:3001/removemobile",
			request
		);

		this.fetchNums();

	}

	componentDidMount(){
		this.fetchNums()
	}

	viewNums = () =>(
		this.state.recordset.map(
			num=>(
				 <InfoBox key={num.mobileNumber}> 
					 <h1>{num.mobileNumber}</h1>
					<Button onClick={()=>{this.removeNum(num)}} >delete</Button>
				 </InfoBox>
			)
		)
	)


	render = () => {

		if (this.state.recordset==null || this.props.user==null){
			return <h1>loading</h1>
		}
		
		return (
			<>
				{this.state.duplicateError? <h1 style={{color:'tomato'}}>ERROR : cannot add an existing number again</h1> : <></>}
				{this.state.emptyError? <h1 style={{color:'tomato'}}>ERROR : field must not be empty</h1> : <></>}
				<Scrollable>
					{this.viewNums()}
					
				</Scrollable>
				<InputBox onChange={(e)=>(this.setState({mobileNumber:e.target.value}))}/>
					<Button onClick={this.addNum} >add tel.</Button>
			</>
		);

	}

}

export default Tel;