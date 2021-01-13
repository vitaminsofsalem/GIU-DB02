import cors from 'cors'
import express from 'express'
import sql from 'mssql'


const dbconfig = { //config for connecting to our mssql server
    user: 'sa',
    password: 'My.DB.Pass',
    server: 'localhost', 
    database: 'GIUERA',
}

let db;
const app = express()
app.listen(3001)

app.use(cors())
app.use(express.json())

app.use(async (req,res,next)=>{
	db=await sql.connect(dbconfig)
	next()
})


const getUserID = async (db,email) =>{ //returns the ID of the user

	let UserID,sqlres;
	try {

		sqlres = await db.request()
			.input('useremail',sql.VarChar,email)
			.query(' SELECT id FROM Users WHERE email=@useremail ')

		console.log("RESULT : ",sqlres)
		UserID = sqlres.recordset[0].id; //get first result found in table
		return UserID;

	}
	catch(err){
		console.log(err)
	}

}

const signUpAs = (flag) => {

	if (flag=='instructor'){
		return 'instructorRegister'
	}
	
	return 'studentRegister';

}

app.post('/userregister', async (req,res)=>{

	try {
		let result;
		let userID;
		let submission = req.body //receives data sent by the request from front end


		let dbres = await db.request() 
			.input('first_name',sql.VarChar,submission.first_name)
			.input('last_name',sql.VarChar,submission.last_name)
			.input('password',sql.VarChar,submission.password)
			.input('email',sql.VarChar,submission.email)
			.input('gender',sql.Bit,submission.gender)
			.input('address',sql.VarChar,submission.address)
			.execute(signUpAs(submission.sign_up_as));
				

		
		userID = await getUserID(db,submission.email); //get the id of the new user

		console.log(dbres);

		result = {
			registerSucceeded:1,  
			msg:'register as ' + submission.sign_up_as + ' was successful, your new ID : ' + userID //send the id to the front end so the user knows his id
		}

		res.send(result); //send the result to the front end
		db.close()//close connection to database

	}
	catch (err){

		console.log(err)
		let result = {
			registerSucceeded:0,
			msg:"sorry, server error has occured"
		}

		res.send(result);


	}


})



app.post('/userlogin',async (req,res)=>{
	try{
		let result;
		let submission = req.body;
		let query = await db.request()
					.input('id',sql.Int,submission.userid)
					.input('password',sql.VarChar,submission.password)
					.output('type',sql.Int)
					.output('success',sql.Bit)
					.execute('userLogin')

		console.log(query)

		if (query.output.success==0){
			
				result = {
					msg : "invalid id or password",
					signedIn:'err',
				}

				res.send(result)
				db.close()
			
		}

		else {
				result = {
					signedIn:1,
					signInAs:query.output.type,
				}

				res.send(result)
				db.close()
		}

		console.log("RESULT:",result);

	}
	catch(err){

				let result = {
					msg : 'sorry, server error has occured',
					signedIn:'err',
				}

		console.log(err)
		db.close()
	}
})