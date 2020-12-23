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
    INSERT INTO InstructorTeachCourse (instId, cid)
    VALUES (@instructorId,SCOPE_IDENTITY())
END
GO

EXEC instructorRegister
    @first_name = 'Rana1',
    @last_name = 'Magdy1',
    @password = 'rana1',
    @email = 'rana1@mail.com',
    @gender = 1,
    @address = 'Cairo1';

EXEC studentRegister
    @first_name = 'merna12',
    @last_name = 'dddd12',
    @password = 'merna12',
    @email = 'merna12@mail.com',
    @gender = 1,
    @address = 'Cro12';

EXEC adminRegister
    @first_name = 'mero',
    @last_name = 'duck',
    @password = 'mero',
    @email = 'mero@mail.com',
    @gender = 0,
    @address = 'Croatia';

DROP PROCEDURE InstAddCourse;
DELETE FROM Users WHERE firstName = 'Merna'
DELETE FROM Instructor Where id = 1
SELECT * FROM Users
SELECT * FROM Course
SELECT * FROM InstructorTeachCourse
SELECT * FROM Instructor
SELECT * FROM Student
SELECT * FROM Admin
DELETE FROM Student WHERE id = 16
DELETE FROM Users WHERE firstName = 'merna'

DECLARE 
@var BIT,
@ty INT

EXEC userLogin
    @id = 15, 
    @password = 'Rana', 
    @success = @var OUTPUT,
    @type = @ty OUTPUT;
SELECT @var AS 'success'
SELECT @ty AS 'type'

EXEC addMobile 
@id = 15,
@mobile_number = '6561318';

SELECT * FROM UserMobileNumber

EXEC adminViewInstrcutorProfile @instrId = 15

EXEC adminViewAllCourses

INSERT INTO Course (name,instructorId)
VALUES ('databases4', 15)

EXEC adminViewNonAcceptedCourses

EXEC adminViewCourseDetails @courseId = 4

EXEC adminAcceptCourse @adminId = 18, @courseId = 5

EXEC adminCreatePromocode 
    @code = 'G101',
    @issueDate = '1/1/2019',
    @expiryDate = '1/1/2020',
    @discount = 10,
    @adminId = 18

SELECT * FROM Promocode

ALTER TABLE Course 
ALTER COLUMN price DECIMAL (6,2)

EXEC adminViewStudentProfile @sid = 17
EXEC adminIssuePromocodeToStudent @sid = 21, @pid = 'G101'
SELECT * FROM StudentHasPromocode

EXEC InstAddCourse 
    @creditHours = 3,
    @name = 'DaB1',
    @courseDescription = 'dbad1',
    @price = 90,
    @instructorID = 22