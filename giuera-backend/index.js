import cors from 'cors'
import express from 'express'
import sql from 'mssql'


const dbconfig = { //config for connecting to our mssql server
    user: 'sa',
    password: 'My.DB.Pass',
    server: 'localhost', 
    database: 'GIUERA',
}

let database;
const app = express()
app.listen(3001)

app.use(cors())
app.use(express.json())

app.use(async (req,res,next)=>{
	database=await sql.connect(dbconfig)
	next()
})


const getUserID = async (db,email) =>{ //returns the ID of the user

	let UserID,query;
	try {

		query = await db.request()
			.input('useremail',sql.VarChar,email)
			.query(' SELECT id FROM Users WHERE email=@useremail ')

		console.log("RESULT : ",query)
		UserID = query.recordset[0].id; //get first result found in table
		return UserID;

	}
	catch(err){
		console.log(err)
	}

}

const signUpAs = (flag) => { //specifies which register procedure to be executed

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


		let query = await database.request() 
			.input('first_name',sql.VarChar,submission.first_name)
			.input('last_name',sql.VarChar,submission.last_name)
			.input('password',sql.VarChar,submission.password)
			.input('email',sql.VarChar,submission.email)
			.input('gender',sql.Bit,submission.gender)
			.input('address',sql.VarChar,submission.address)
			.execute(signUpAs(submission.sign_up_as));
				

		
		userID = await getUserID(database,submission.email); //get the id of the new user

		console.log(query);

		result = {
			registerSucceeded:1,  
			msg:'register as ' + submission.sign_up_as + ' was successful, your new ID : ' + userID //send the id to the front end so the user knows his id
		}

		res.send(result); //send the result to the front end
		database.close()//close connection to database

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


//request for logging in

app.post('/userlogin',async (req,res)=>{
	try{
		let result; 
		let submission = req.body; //get request body from front end client
		let query = await database.request() //start querying
					.input('id',sql.Int,submission.userid) //specify userid (recieved from front end) as input 
					.input('password',sql.VarChar,submission.password) //specify password (recieved from front end) as input 
					.output('type',sql.Int) 
					.output('success',sql.Bit)
					.execute('userLogin')

		console.log(query)

		if (query.output.success==0){ //if login fails
			
				result = {
					msg : "invalid id or password",
					signedIn:'err',
				}

				res.send(result)
				database.close()
			
		}

		else {
				result = {
					signedIn:1,
					signInAs:query.output.type,
				}

				res.send(result)
				database.close()
		}

		console.log("RESULT:",result);

	}
	catch(err){

		let result = {
			msg : 'sorry, server error has occured',
			signedIn:'err',
		}

		res.send(result)

		console.log(err)
		database.close()
	}
})