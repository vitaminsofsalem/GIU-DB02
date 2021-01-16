
const DashboardStyles={
	bg:{
		margin:'0',
		padding:'15px',
		width:"100vw",
		height:"100vh",
		backgroundColor:"#222222",
		display:'flex',
		flexDirection:'column',
	},
	card:{
		color:"white",
		width:"380px",
		height:"600px",
		padding:"20px",
		margin:"10px",
		backgroundColor:"#444444",
		display:"flex",
		flexDirection:"column",
		borderRadius:"10px"
	},
	cardsContainer:{
		margin:"0",
		backgroundColor:"#222222",
		display : "flex",
		flexWrap : "wrap",
		flexDirection:"row",
		width:"100vw",
	},
	button:{
		display:"inline-block",
		height:"40px",
		width:"250px",
		border : "none",
		borderRadius:"20px",
		color: "black",
		backgroundColor:"white",

	},
	InfoBox:{
		color:"white",
		justifyContent:"space-around",
		margin:"10px",
		width:"90%",
		height:"200px",
		padding:"5px",
		backgroundColor:"#5f5f5f",
		display:"flex",
		flexDirection:"column",
		borderRadius:"5px"
	},
	win:{
		position:'fixed',
		top:'50%',
		left:'50%',
		color:"white",
		width:"80vw",
		height:"80vh",
		marginTop:"-40vh",
		marginLeft:"-40vw",
		padding:"20px",
		backgroundColor:"#777777",
		display:"flex",
		flexDirection:"column",
		borderRadius:"10px"
	},

}

export default DashboardStyles