import cors from "cors";
import express from "express";
import sql from "mssql";

const SERVER_ERROR = "Server encountered an error";

const dbconfig = {
	//config for connecting to our mssql server
	user: "sa",
	password: "My.DB.Pass",
	server: "localhost",
	database: "GIUERA",
};

let database;
const app = express();
app.listen(3001);

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
	database = await sql.connect(dbconfig);
	next();
});

const getUserID = async (db, email) => {
	//returns the ID of the user

	let UserID, query;
	try {
		query = await db
			.request()
			.input("useremail", sql.VarChar, email)
			.query(" SELECT id FROM Users WHERE email=@useremail ");

		console.log("RESULT : ", query);
		UserID = query.recordset[0].id; //get first result found in table
		return UserID;
	} catch (err) {
		console.log(err);
	}
};

const signUpAs = (flag) => {
	//specifies which register procedure to be executed

	if (flag === "instructor") {
		return "instructorRegister";
	}

	return "studentRegister";
};

app.post("/userregister", async (req, res) => {
	try {
		let result;
		let userID;
		let submission = req.body; //receives data sent by the request from front end

		let query = await database
			.request()
			.input("first_name", sql.VarChar, submission.firstName)
			.input("last_name", sql.VarChar, submission.lastName)
			.input("password", sql.VarChar, submission.password)
			.input("email", sql.VarChar, submission.email)
			.input("gender", sql.Bit, submission.gender)
			.input("address", sql.VarChar, submission.address)
			.execute(signUpAs(submission.signUpAs));

		userID = await getUserID(database, submission.email); //get the id of the new user

		console.log(query);

		result = {
			registerSucceeded: 1,
			msg:
				"register as " +
				submission.signUpAs +
				" was successful, your new ID : " +
				userID, //send the id to the front end so the user knows his id
		};

		res.status(200);
		res.send(result); //send the result to the front end
		database.close(); //close connection to database
	} catch (err) {
		console.log(err);
		let result = {
			registerSucceeded: 0,
			msg: "sorry, server error has occured",
		};

		res.status(500);
		res.send(result);
	}
});

app.post("/userlogin", async (req, res) => {
	try {
		let result;
		let submission = req.body; //get request body from front end client
		let query = await database
			.request() //start querying
			.input("id", sql.Int, submission.userid) //specify userid (recieved from front end) as input
			.input("password", sql.VarChar, submission.password) //specify password (recieved from front end) as input
			.output("type", sql.Int)
			.output("success", sql.Bit)
			.execute("userLogin");

		console.log(query);

		if (query.output.success == 0) {
			//if login fails

			result = {
				msg: "invalid id or password",
				signedIn: "err",
			};

			res.send(result);
			database.close();
		} else {
			result = {
				signedIn: 1,
				signInAs: query.output.type,
			};

			res.send(result);
			database.close();
		}

		console.log("RESULT:", result);
	} catch (err) {
		let result = {
			msg: "sorry, server error has occured",
			signedIn: "err",
		};

		res.status(500);
		res.send(result);

		console.log(err);
		database.close();
	}
});


app.post("/removemobile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.id)
			.input("mobile_number", sql.VarChar, reqBody.mobileNumber)
			.query("DELETE FROM UserMobileNumber WHERE @mobile_number=mobilenumber AND @id=id")


		res.status(200);

		res.send({
			msg: "success",
		});

	} catch (err) {
				

		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/addmobile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.id)
			.input("mobile_number", sql.VarChar, reqBody.mobileNumber)
			.execute("addMobile");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewmobile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.id)
			.query('SELECT * FROM UserMobileNumber WHERE id=@id')

		console.log(dbReq);

		res.status(200);
		res.send({
			recordset : dbReq.recordset,
			msg: "success",
		});

		
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/addcourse", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("creditHours", sql.Int, reqBody.credit_hours)
			.input("name", sql.VarChar, reqBody.name)
			.input("courseDescription", sql.VarChar, reqBody.description)
			.input("price", sql.Decimal, reqBody.price)
			.input("instructorId", sql.Int, reqBody.instructorid)
			.execute("InstAddCourse");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/updatecoursecontent", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instrId", sql.Int, reqBody.instructorid)
			.input("courseId", sql.VarChar, reqBody.courseid)
			.input("content", sql.VarChar, reqBody.content)
			.execute("UpdateCourseContent");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/updatecoursedescription", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instrId", sql.Int, reqBody.instructorid)
			.input("courseId", sql.Int, reqBody.courseid)
			.input("content", sql.VarChar, reqBody.description)
			.execute("UpdateCourseDescription");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/addinstructorcourse", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instId", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("adderIns", sql.VarChar, reqBody.adder_instructorid)
			.execute("AddAnotherInstructorToCourse");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewacceptedcourses", async (req, res) => {
	try {
		//Not calling procedure to show all courses of instructor not only accepeted, due to lack of admin implementation
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.query(
				"SELECT id, name, creditHours FROM Course WHERE instructorId = " +
					reqBody.instructorid
			);

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/definecoursepreq", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("prerequsiteId", sql.Int, reqBody.prerequsite_cid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("DefineCoursePrerequisites");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/defineassignment", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instId", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("number", sql.Int, reqBody.number)
			.input("type", sql.VarChar, reqBody.type)
			.input("fullGrade", sql.Int, reqBody.fullGrade)
			.input("weight", sql.Decimal, reqBody.weight)
			.input("deadline", sql.DateTime, reqBody.deadline) //sent as string in format yyyy-mm-dd
			.input("content", sql.VarChar, reqBody.content)
			.execute("DefineAssignmentOfCourseOfCertianType");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/instructorprofile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instId", sql.Int, reqBody.instructorid)
			.execute("ViewInstructorProfile");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			...dbReq.recordset[0],
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewstudentassignments", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instId", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("InstructorViewAssignmentsStudents");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/gradeassignment", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instrId", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("sid", sql.Int, reqBody.studentid)
			.input("assignmentNumber", sql.Int, reqBody.assignment_number)
			.input("type", sql.VarChar, reqBody.type)
			.input("grade", sql.Decimal, reqBody.grade)
			.execute("InstructorgradeAssignmentOfAStudent");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewstudentfeedback", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instrId", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("ViewFeedbacksAddedByStudentsOnMyCourse");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/issuecertificate", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("instID", sql.Int, reqBody.instructorid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("sid", sql.Int, reqBody.studentid)
			.input("issueDate", sql.DateTime, reqBody.issue_date) //sent as string in format yyyy-mm-dd
			.execute("InstructorIssueCertificateToStudent");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/studentprofile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.studentid)
			.execute("viewMyProfile");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			...dbReq.recordset[0],
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/editprofile", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.userid)
			.input("firstName", sql.VarChar, reqBody.firstName)
			.input("lastName", sql.VarChar, reqBody.lastName)
			.input("password", sql.VarChar, reqBody.password)
			.input("gender", sql.Bit, reqBody.gender)
			.input("email", sql.VarChar, reqBody.email)
			.input("address", sql.VarChar, reqBody.address)
			.execute("editMyProfile");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.get("/availablecourses", async (_, res) => {
	try {
		//Not calling procedure to show all courses instead, due to lack of admin implementation
		const dbReq = await database.request().query("select * from COURSE ");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			recordset: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewenrolled", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.query(
				"SELECT * FROM Course a  LEFT JOIN StudentTakeCourse b on a.id=b.cid WHERE @sid=sid"
			);

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			courses: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/courseinformation", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("id", sql.Int, reqBody.courseid)
			.execute("courseInformation");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			...dbReq.recordset[0],
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/enrollincourse", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("cid", sql.Int, reqBody.courseid)
			.input("sid", sql.Int, reqBody.studentid)
			.input("instr", sql.Int, reqBody.instructorid)
			.execute("enrollInCourse");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/addcreditcard", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("number", sql.VarChar, reqBody.number)
			.input("sid", sql.Int, reqBody.sid)
			.input("cardHolderName", sql.VarChar, reqBody.cardHolderName)
			.input("cvv", sql.VarChar, reqBody.cvv)
			.input("expiryDate", sql.DateTime, reqBody.expiryDate)
			.execute("addCreditCard");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewpromo", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.execute("viewPromocode");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/paycourse", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("payCourse");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/enrollincourseview", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("id", sql.Int, reqBody.courseid)
			.execute("enrollInCourseViewConent");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewassignments", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("viewAssign");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			data: dbReq.recordset,
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/submitassign", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("assignnumber", sql.Int, reqBody.assignment_number)
			.input("assignType", sql.Int, reqBody.assignment_type)
			.execute("submitAssign");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewassigngrade", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("assignnumber", sql.Int, reqBody.assignment_number)
			.input("assignType", sql.Int, reqBody.assignment_type)
			.execute("viewAssignGrades");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			...reqBody.recordset[0],
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewfinalgrade", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.execute("viewFinalGrade");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			...reqBody.recordset[0],
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/addfeedback", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.studentid)
			.input("cid", sql.Int, reqBody.courseid)
			.input("comment", sql.VarChar, reqBody.comment)
			.execute("addFeedback");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/rateinstructor", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.sid)
			.input("instId", sql.Int, reqBody.iid)
			.input("rate", sql.Decimal, reqBody.rate)
			.execute("rateInstructor");

		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
		});
	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});

app.post("/viewcertificate", async (req, res) => {
	try {
		const reqBody = req.body;
		const dbReq = await database
			.request()
			.input("sid", sql.Int, reqBody.sid)
			.input("cid", sql.Int, reqBody.cid)
			.execute("viewCertificate");

		console.log(reqBody);
		console.log(dbReq);

		res.status(200);
		res.send({
			msg: "success",
			recordset : dbReq.recordset,
		});


	} catch (err) {
		console.log(err);
		const result = {
			msg: SERVER_ERROR,
		};
		res.status(500);
		res.send(result);
	}
});



