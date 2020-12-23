CREATE PROC UpdateCourseContent
	@instrId INT,
	@courseId INT,
	@content VARCHAR(200)
AS
	UPDATE Course SET content = @content WHERE id = @courseId AND instructorId = @instrId;
GO

CREATE PROC UpdateCourseDescription
	@instrId INT,
	@courseId INT,
	@content VARCHAR(200)
AS
	UPDATE Course SET courseDescription = @content WHERE id = @courseId AND instructorId = @instrId;
GO

CREATE PROC AddAnotherInstructorToCourse
	@instId INT,
	@cid INT,
	@adderIns INT
AS
	INSERT INTO InstructorTeachCourse
	SELECT @instId, @cid
	FROM InstructorTeachCourse ic
	WHERE ic.cid = @cid AND ic.instId = @adderIns;
GO

CREATE PROC InstructorViewAcceptedCoursesByAdmin
	@instrId INT
AS
	SELECT id, name, creditHours FROM Course WHERE instructorId = @instrId AND accepted = 1;
GO

CREATE PROC DefineCoursePrerequisites
	@cid INT,
	@prerequsiteId INT
AS
	INSERT INTO CoursePrerequisiteCourse VALUES(@prerequsiteId,@cid);
GO

CREATE PROC DefineAssignmentOfCourseOfCertianType
	@instId INT,
	@cid INT,
	@number INT,
	@type VARCHAR(10),
	@fullGrade INT,
	@weight DECIMAL(4,1),
	@deadline DATETIME,
	@content VARCHAR(200)
AS
	INSERT INTO Assignment  
	SELECT @cid, @number, @type, @fullGrade, @weight, @deadline, @content
	FROM InstructorTeachCourse ic
	WHERE ic.cid = @cid AND ic.instId = @instId;
GO



CREATE PROC ViewInstructorProfile
	@instId INT
AS
	EXEC updateInstructorRate @instId

	SELECT firstName, lastName, gender, email, address, rating, mobileNumber
	FROM UserMobileNumber INNER JOIN (Instructor INNER JOIN Users
	ON Instructor.id = Users.id)
	ON UserMobileNumber.id = Instructor.id
	WHERE Instructor.id = @instId;
GO

CREATE PROC updateInstructorRate
	@instId INT
AS
	UPDATE ins SET ins.rating = r.average
	FROM
	Instructor ins
	INNER JOIN
	(SELECT instId, AVG(rate) AS average
	FROM StudentRateInstructor s
	GROUP BY instId) r
	ON instId = ins.id;
GO

CREATE PROC InstructorViewAssignmentsStudents
	@instId INT,
	@cid INT
AS
	SELECT sid, cid, assignmentNumber, assignmentType
	FROM Assignment a INNER JOIN (StudentTakeAssignment sa INNER JOIN InstructorTeachCourse ic
	ON sa.cid = ic.cid)
	ON a.number = sa.assignmentNumber AND a.cid =  sa.cid AND a.type = sa.assignmentType
	WHERE sa.cid = @cid AND ic.instId = @instId;
GO

CREATE PROC InstructorgradeAssignmentOfAStudent
	@instrId INT,
	@sid INT,
	@cid INT,
	@assignmentNumber INT,
	@type VARCHAR(10),
	@grade DECIMAL(5,2)
AS
	UPDATE StudentTakeAssignment SET grade = @grade
	FROM InstructorTeachCourse ic 
	WHERE ic.instId = @instrId AND ic.cid = @cid AND StudentTakeAssignment.assignmentNumber = @assignmentNumber AND StudentTakeAssignment.sid = @sid 
	AND StudentTakeAssignment.assignmentType = @type AND StudentTakeAssignment.cid = @cid;
GO

CREATE PROC ViewFeedbacksAddedByStudentsOnMyCourse
	@instrId INT,
	@cid INT
AS
	SELECT number, comment, numberOfLikes FROM Feedback f INNER JOIN InstructorTeachCourse ic
	ON f.cid = ic.cid
	WHERE ic.instId = @instrId AND f.cid = @cid;
GO

CREATE PROC InstructorIssueCertificateToStudent
	@cid INT,
	@sid INT,
	@instID INT,
	@issueDate DATETIME
AS
	INSERT INTO StudentCertifyCourse 
	SELECT @sid,@cid,@issueDate
	FROM InstructorTeachCourse ic
	WHERE ic.instId = @instID AND ic.cid = @cid
GO

CREATE PROC viewMyProfile
	@id INT
AS
	SELECT id, gpa, firstName, lastName, password, gener, email, address FROM Student s INNER JOIN Users u
	ON s.id = u.id
	WHERE s.id = @id;
GO

CREATE PROC editMyProfile
	@id INT,
	@firstName VARCHAR(10),
	@lastName VARCHAR(10),
	@password VARCHAR(10),
	@gender BIT,
	@email VARCHAR(10),
	@address VARCHAR(10)
AS
	UPDATE Users SET
	firstName = @firstName,
	lastName = @lastName,
	password = @password,
	gender = @gender,
	email = @email,
	address = @address
	WHERE Users.id = @id;
GO


