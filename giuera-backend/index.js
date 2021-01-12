import cors from 'cors'
import express from 'express'
import sql from 'mssql'

const dbconfig = { //config for connecting to our mssql server
    user: 'sa',
    password: 'My.DB.Pass',
    server: 'localhost', 
    database: 'GIUERA',
}



const app = express()
app.listen(3001)
app.use(cors())
app.use(express.json())




const queryTest = async () => {

	let mydb = await sql.connect(dbconfig);
	let qres =  await mydb.query("SELECT * from Users JOIN Student on (Users.id=Student.id) ")
	console.log(qres)
	mydb.close()

}

queryTest();

app.get('/test',(req,res)=>{

	let obj = {
		msg:"json test",
		greet:"hello client"
	}

	res.send(obj)
})