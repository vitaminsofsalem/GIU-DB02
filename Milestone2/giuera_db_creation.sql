CREATE DATABASE GIUERA
USE GIUERA


CREATE TABLE Users(
	id INT IDENTITY(1,1) PRIMARY KEY,
	firstName VARCHAR(64),
	lastName  VARCHAR(64),
	password VARCHAR(64),
	gender VARCHAR(8),
	email VARCHAR(128) UNIQUE,
	address VARCHAR(128),
);


CREATE TABLE UserMobileNumber(
	mobileNumber VARCHAR(64),
	id INT FOREIGN KEY REFERENCES Users(id),
	PRIMARY KEY(mobileNumber,id)
);

CREATE TABLE Instructor(
	id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(id),
	rating TINYINT
);


CREATE TABLE Student(
	id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(id),
	gpa DECIMAL(2,2)
);


CREATE TABLE Admin(
	id INT PRIMARY KEY FOREIGN KEY REFERENCES Users(id)
);

CREATE TABLE Course(
	id INT IDENTITY(1,1) PRIMARY KEY,
	creditHours INT,
	name VARCHAR(64),
	courseDescription VARCHAR(512),
	price DECIMAL(2,2),
	content VARCHAR(1024),
	accepted BIT,
	adminId INT FOREIGN KEY REFERENCES Admin(id),
	instructorId INT FOREIGN KEY REFERENCES Instructor(id),
);

CREATE TABLE Assignment(
	cid INT FOREIGN KEY REFERENCES Course(id),
	number INT,
	type INT,
	fullGrade DECIMAL(2,2),
	weight INT,
	deadline DATE,
	content VARCHAR(1024),
	PRIMARY KEY(cid,number,type)
);

CREATE TABLE Feedback(
	cid INT FOREIGN KEY REFERENCES Course(id),
	number INT,
	numberOfLikes INT,
	comments VARCHAR(1024),
	sid INT FOREIGN KEY REFERENCES Student(id),
    PRIMARY KEY(cid,number)
);

CREATE TABLE Promocode(
	code VARCHAR(16) PRIMARY KEY,
	issueDate DATE,
	expiryDate DATE,
	discountAmount DECIMAL(3,3),
	adminID INT FOREIGN KEY REFERENCES Admin(id)
);

CREATE TABLE StudentHasPromocode(
	sid INT FOREIGN KEY REFERENCES Student(id),
	code VARCHAR(16) FOREIGN KEY REFERENCES Promocode(code),
	PRIMARY KEY(sid,code)
);

CREATE TABLE CreditCard(
	number VARCHAR(64) PRIMARY KEY,
	cardHolderName VARCHAR(64),
	expiryDate DATE,
	cvv VARCHAR(8)
);

CREATE TABLE StudentAddCreditCard(
	sid INT FOREIGN KEY REFERENCES Student(id),
	creditCardNumber VARCHAR(64) FOREIGN KEY REFERENCES CreditCard(number),
	PRIMARY KEY(sid, creditCardNumber)
);

CREATE TABLE StudentTakeCourse(
	sid INT FOREIGN KEY REFERENCES Student(id),
	cid INT FOREIGN KEY REFERENCES Course(id),
	instId INT FOREIGN KEY REFERENCES Instructor(id),
	payedfor BIT,
	grade DECIMAL(2,2),
	PRIMARY KEY(sid,cid,instId)
);

CREATE TABLE StudentTakeAssignment(
	sid INT FOREIGN KEY REFERENCES Student(id),
	assignmentNumber INT,
	cid INT,
	assignmentType INT,
	FOREIGN KEY (cid, assignmentNumber, assignmentType) REFERENCES Assignment(cid, number,type),
	PRIMARY KEY(sid,assignmentNumber,cid,assignmentType)
);

CREATE TABLE StudentRateInstructor(
	sid INT FOREIGN KEY REFERENCES Student(id),
	instId INT FOREIGN KEY REFERENCES Instructor(id),
	rate TINYINT,
	PRIMARY KEY(sid,instId)
);

CREATE TABLE StudentCertifyCourse(
	sid INT FOREIGN KEY REFERENCES Student(id),
	cid INT FOREIGN KEY REFERENCES Course(id),
	issueDate DATE,
	PRIMARY KEY(sid,cid)
);

CREATE TABLE CoursePrerequisiteCours(
	prerequisteId INT FOREIGN KEY REFERENCES Course(id),
	cid INT FOREIGN KEY REFERENCES Course(id),
	PRIMARY KEY(prerequisteId,cid)
);

CREATE TABLE InstructorTeachCourse(
	instId INT FOREIGN KEY REFERENCES Instructor(id),
	cid INT FOREIGN KEY REFERENCES Course(id),
	PRIMARY KEY(instId,cid)
);





