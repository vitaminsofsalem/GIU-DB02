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
INSERT INTO Student (id)
SELECT Users.id FROM Users
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
VALUES (@first_name, @password, @email, @gender, @address)
GO

CREATE PROCEDURE userLogin 
    @id INT,
    @password VARCHAR(20)
AS
SELECT * FROM Users
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
SELECT * FROM Instructor INNER JOIN Users ON
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
WHERE accepted = 0
GO

CREATE PROCEDURE adminViewCourseDetails 
    @courseId INT
AS
SELECT * FROM Course
WHERE @courseID = Course.id
GO

CREATE PROCEDURE adminAcceptRejectCourse
    @adminId INT,
    @courseID INT
AS
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
SELECT * FROM Student
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
INSERT INTO StudentHasPromocode (sid , code)
VALUES (@sid, @pid)
GO

CREATE PROCEDURE InstAddCourse
    @creditHours INT,
    @name VARCHAR(10),
    @courseDescription VARCHAR(200),
    @price DECIMAL(6,2),
    @instructorId INT
AS
INSERT INTO Course (creditHours, name, price, content, instructorID)
VALUES (@creditHours, @name, @courseDescription, @price, @instructorID)
GO