CREATE PROCEDURE studentRegister 
	@first_name VARCHAR(20), 
    @last_name VARCHAR (20),
	@password VARCHAR(20), 
	@email VARCHAR(50), 
	@gender BIT, 
	@address VARCHAR(10)
AS
	INSERT INTO Users (firstName, lastName, gender, email, password, address)
	VALUES (@first_name, @last_name, @gender, @email, @password, @address)
	INSERT INTO Student (id, gpa)
	VALUES (SCOPE_IDENTITY(), 0.0)
GO

CREATE PROCEDURE instructorRegister 
    @first_name VARCHAR(20), 
    @last_name VARCHAR(20), 
    @password VARCHAR (20),
    @email VARCHAR(50),
    @gender BIT,
    @address VARCHAR (10)
AS
	INSERT INTO Users (firstName, lastName, gender, email, password, address)
	VALUES (@first_name, @last_name, @gender, @email, @password, @address)
	INSERT INTO Instructor (id,rating)
	VALUES (SCOPE_IDENTITY(), 0.0)
GO

CREATE PROCEDURE adminRegister 
    @first_name VARCHAR(20), 
    @last_name VARCHAR(20), 
    @password VARCHAR (20),
    @email VARCHAR(50),
    @gender BIT,
    @address VARCHAR (10)
AS
	INSERT INTO Users (firstName, lastName, gender, email, password, address)
	VALUES (@first_name, @last_name, @gender, @email, @password, @address)
	INSERT INTO Admin (id)
	VALUES (SCOPE_IDENTITY())
GO

CREATE PROCEDURE userLogin 
    @id INT,
    @password VARCHAR(20),
    @success BIT OUTPUT,
    @type INT OUTPUT
AS
	BEGIN 
		IF EXISTS (SELECT * FROM Users WHERE id = @id AND password = @password)
		BEGIN
			IF EXISTS (SELECT * FROM Student WHERE id = @id)
				BEGIN
					SELECT @success = 1, @type = 2;
				END
			ELSE IF EXISTS (SELECT * FROM Instructor WHERE id = @id)
				BEGIN
					SELECT @success = 1, @type = 1;
				END
			ELSE
				BEGIN
					SELECT @success = 1, @type = 0;
				END
		END
		ELSE IF NOT EXISTS (SELECT * FROM Users WHERE id = @id AND password = @password)
			BEGIN
				SELECT @success = 0
			END
		END
GO

CREATE PROCEDURE addMobile
    @id INT,
    @mobile_number VARCHAR(20)
AS
	INSERT INTO UserMobileNumber (id, mobileNumber)
	VALUES (@id, @mobile_number)
GO

CREATE PROCEDURE adminListInstr
AS
SELECT * FROM Instructor
GO

CREATE PROCEDURE adminViewInstrcutorProfile 
    @instrId INT
AS
	SELECT 
		Users.firstName,
		Users.LastName,
		Users.gender,
		Users.password,
		Users.email,
		Users.address,
		Users.id
	FROM Instructor RIGHT JOIN Users ON
	Instructor.id = Users.id WHERE @instrID = Instructor.id
GO

CREATE PROCEDURE adminViewAllCourses
AS
	SELECT * FROM Course
GO

CREATE PROCEDURE adminViewNonAcceptedCourses
AS
	SELECT * FROM Course 
	INNER JOIN Instructor 
	ON Course.instructorid = Instructor.id
	WHERE accepted IS NULL
GO

CREATE PROCEDURE adminViewCourseDetails 
    @courseId INT
AS
	SELECT * FROM Course
	WHERE @courseID = Course.id
GO

CREATE PROCEDURE adminAcceptCourse
    @adminId INT,
    @courseID INT
AS
	IF EXISTS (SELECT * FROM Course WHERE id = @Courseid)
	BEGIN
		IF EXISTS (SELECT * FROM Course WHERE accepted IS NULL)
		BEGIN
			UPDATE Course
			SET accepted = 1, adminId = @adminId
			WHERE @courseID = id
		END
	END
GO

CREATE PROCEDURE adminCreatePromocode
    @code VARCHAR(6),
    @issueDate DATETIME,
    @expiryDate DATETIME,
    @discount DECIMAL (4,2),
    @adminID INT
AS
	INSERT INTO Promocode (code, issueDate, expiryDate, discount, adminID)
	VALUES (@code, @issueDate, @expiryDate, @discount, @adminID)
GO

CREATE PROCEDURE adminListAllStudents
AS
	SELECT 
		firstName,
		lastName, 
		Users.id
	FROM Student
	INNER JOIN Users 
	ON Student.id = Users.id
GO

CREATE PROCEDURE adminViewStudentProfile
    @sid INT
AS
	SELECT * FROM Student
	INNER JOIN Users 
	ON Student.id = Users.id
	WHERE @sid = Student.id
GO

CREATE PROCEDURE adminIssuePromocodeToStudent
    @sid INT,
    @pid VARCHAR(6)
AS
	IF EXISTS (SELECT * FROM Student WHERE id = @sid)
	BEGIN
		IF EXISTS (SELECT * FROM Promocode WHERE code = @pid)
		BEGIN
			INSERT INTO StudentHasPromocode (sid, code)
			VALUES (@sid, @pid)
		END
	END
GO

CREATE PROCEDURE InstAddCourse
    @creditHours INT,
    @name VARCHAR(10),
    @courseDescription VARCHAR(200),
    @price DECIMAL(6,2),
    @instructorId INT
AS
	IF EXISTS (SELECT * FROM Instructor WHERE @instructorId = Instructor.id)
	BEGIN
		INSERT INTO Course (creditHours, name, courseDescription , price, instructorID)
		VALUES (@creditHours, @name, @courseDescription, @price, @instructorID)
		INSERT INTO ic (instId, cid)
		VALUES (@instructorId,SCOPE_IDENTITY())
	END
GO

-- 14 to 28

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
	INSERT INTO ic
	SELECT @instId, @cid
	FROM ic ic
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
	FROM ic ic
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
	SELECT sid, a.cid, assignmentNumber, assignmentType
	FROM Assignment a INNER JOIN (StudentTakeAssignment sa INNER JOIN InstructorTeachCourse ic 
	ON sa.cid = ic.cid)
	ON a.number = sa.assignmentNumber AND a.cid = sa.cid AND a.type = sa.assignmentType
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
	UPDATE sa SET grade = @grade
	FROM ic ic 
	WHERE ic.instId = @instrId AND ic.cid = @cid AND sa.assignmentNumber = @assignmentNumber AND sa.sid = @sid 
	AND sa.assignmentType = @type AND sa.cid = @cid;
GO

CREATE PROC ViewFeedbacksAddedByStudentsOnMyCourse
	@instrId INT,
	@cid INT
AS
	SELECT number, comment, numberOfLikes FROM Feedback f INNER JOIN ic ic
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
	FROM ic ic
	WHERE ic.instId = @instID AND ic.cid = @cid
GO

CREATE PROC viewMyProfile
	@id INT
AS
	SELECT id, gpa, firstName, lastName, password, gender, email, address 
	FROM Student s
	INNER JOIN Users u
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


--Procs from 28 to 42--	

CREATE PROC availablecourses
AS
	SELECT  name,price 
	FROM Course WHERE 	
	accepted = 1
GO

CREATE PROC courseInformation
	@id INT
AS
	SELECT C.courseDescription,U.firstName,U.lastName
	FROM Course C,Users U
	WHERE U.id = C.instructorId
GO


CREATE PROC enrollInCourse
	@sid INT,
	@cid INT,
	@instr INT
AS
	INSERT INTO StudentTakeCourse
		(sid,cid,instId)
	VALUES (@sid,@cid,@instr)
GO


CREATE PROC addCreditCard
	 @sid int,
	 @number varchar(15),
	 @cardHolderName varchar(16),
	 @expiryDate datetime,
	 @cvv varchar(3)
AS
	INSERT INTO CreditCard
		(cardHolderName,expiryDate,cvv)	
	VALUES (@cardHolderName,@expiryDate,@cvv);

	INSERT INTO StudentAddCreditCard
		(sid,creditCardNumber)
	VALUES (@sid,@number);
GO


CREATE PROC viewPromocode
	@sid INT
AS
	SELECT code FROM StudentHasPromocode
	WHERE @sid=StudentHasPromocode.sid
GO


CREATE PROC payCourse
	@cid INT,
	@sid INT
AS
	UPDATE StudentTakeCourse SET payedfor= 1 WHERE @cid=cid AND @sid=sid
GO

CREATE PROC enrollInCourseViewConent
	@id INT,
	@sid INT
AS
	SELECT Content FROM StudentTakeCourse JOIN Course ON content.sid=StudentTakeCourse.sid
	WHERE sid=@sid AND cid=@id
GO

CREATE PROC viewAssign
	@cid INT,
	@sid INT
AS
	SELECT * FROM 
	Assignment JOIN STudentTakeAssignment ON number=assignmentNumber WHERE
	sid=@sid
GO

CREATE PROC submitAssign
	 @assignType VARCHAR(10),
	 @assignnumber INT, 
	 @sid INT,
	 @cid INT
AS
	INSERT INTO sa
		(sid,assignmentNumber,cid,assignmentType)
	VALUES (@sid,@assignnumber,@cid,@assignType);
GO



CREATE PROC viewAssignGrades
	 @assignType VARCHAR(10),
	 @assignnumber INT, 
	 @sid INT,
	 @cid INT,
	 @assignGrade DECIMAL(5,2)
AS
	SET @assignGrade =  (
		SELECT grade FROM Assignment JOIN sa ON number=assignmentNumber WHERE
		@sid=sid AND @assignnumber=number AND @cid=cid and @assignType = type
	)
GO


CREATE PROC viewFinalGrade
	@cid INT,
	@sid INT,
	@finalGrade DECIMAL(10,2)
AS
	SET @finalGrade = (
		SELECT grade FROM StudentTakeCourse WHERE
		@sid=sid AND @cid=cid
	)
GO



CREATE PROC addFeedback
	@cid INT,
	@sid INT,
	@comment VARCHAR(100)
AS
	INSERT INTO Feedback
		(cid,comment,sid)
	VALUES (@cid,@comment,@sid)
GO




CREATE PROC rateInstructor
	@sid INT,
	@instId INT,
	@rate DECIMAL(2,1)
AS

	INSERT INTO StudentRateInstructor
		(sid,instId,rate)
	VALUES (@sid,@instId,@rate)

	UPDATE Instructor SET rating = (SELECT AVG(rate) FROM StudentRateInstructor WHERE @instId = instructor.id)
	WHERE @instId = instructor.id
GO

CREATE PROC viewCertificate
	@cid INT,
	@sid INT
AS
	SELECT * FROM StudentCertifyCourse WHERE @sid = sid AND @cid = cid
GO

EXEC InstructorViewAssignmentsStudents 
	@instId = 2,
	@cid = 1


SELECT * FROM Users
SELECT * FROM Course
SELECT * FROM StudentTakeAssignment
SELECT * FROM CoursePrerequisiteCourse
SELECT * FROM StudentRateInstructor
SELECT * FROM Instructor
SELECT * FROM ic
SELECT * FROM Student
SELECT * FROM Admin
SELECT * FROM UserMobileNumber 
SELECT * FROM Assignment

EXEC studentRegister
	@first_name = 'merna232',
	@last_name = 'michel223',
	@password = 'mern2a23',
	@email = 'm23@mail.com',
	@gender = 1,
	@address = 'Nasr 2City2'