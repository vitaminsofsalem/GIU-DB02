import React from 'react'


class Certificate extends React.Component{

	constructor(props){
		super(props)
		this.state={
			recordset:null,
		}
	}

	fetchCertificate= async ()=>{

			const sub= {
				sid:this.props.sid,
				cid:this.props.cid,
			}

				const request = {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(sub),
				};

				let response = await fetch(
					"http://localhost:3001/viewcertificate",
					request
				);

				let data = await response.json()
				this.setState({recordset:data.recordset})
	}

	componentDidMount = () => {
		this.fetchCertificate()
	}

	render(){
		if (this.state.recordset==null){
			return(
				<h1>loading</h1>
			)
		}

		if (this.state.recordset.length==0){
			return(
				<h1>not yet certified</h1>
			)
		}

		if (this.state.recordset.length){
			return(
				<>
					<h1 style={{color:'#22ff22'}}>congrats! you are certified in this course</h1>
					<h2 style={{color:'green'}}>issue date : {this.state.recordset[0].issuedate}</h2>
				</>
			)
		}


	}
}
export default Certificate