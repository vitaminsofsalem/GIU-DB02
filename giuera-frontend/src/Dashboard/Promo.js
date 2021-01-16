import React from 'react'
import InfoBox from './InfoBox'
import Scrollable from './Scrollable';
import Button from './Button';

class Promo extends React.Component {


	constructor(props){
		super(props);		

		this.state = {
			recordset:null,
			viewFlag:0,
			msg:'',
		}


		
	}

	fetchPromoCodes= async () => {

				let sub = {
					sid:this.props.getsid(),
				}
				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(sub),
				};

				let response = await fetch(
					"http://localhost:3001/viewpromo",
					request
				);
				let data = await response.json();

				this.setState({
					msg:data.msg,
					recordset:data.recordset
				})
			
	}



	viewPromo = () => (
		this.state.recordset.map(rs=>(
			<InfoBox key={rs.code}>
				<h1>{rs.code}</h1>
			</InfoBox>
		))
	)

	render = () => {
		console.log("PROMO:",this.props.sid,this.state.recordset)
		if (this.state.recordset==null && this.state.viewFlag==1){
			return <h1>Loading</h1>
		}

		if (!this.state.viewFlag){
			return(
				<Button onClick={()=>{
					this.fetchPromoCodes()
					this.setState({viewFlag:1})
				}}>view promos</Button>
			)
		}

		return (
			<>
			<Scrollable>
				{this.viewPromo()}
			</Scrollable>
				<Button onClick={()=>{
					this.setState({viewFlag:0})
				}}>hide promos</Button>
			</>
		)
	}


}

export default Promo