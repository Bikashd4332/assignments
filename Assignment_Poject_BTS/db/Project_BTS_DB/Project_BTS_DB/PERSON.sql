USE DB_BTS;


CREATE TABLE [PERSON]
	(
		[PersonID] INTEGER IDENTITY(1, 1) NOT NULL,
		[FirstName] VARCHAR(30) NOT NULL,
		[MiddleName] VARCHAR(30) ,
		[LastName] VARCHAR(30) NOT NULL,
		[ContactNumber] INTEGER NOT NULL,
		[EmailID] VARCHAR(50) NOT NULL,
		[ProjectID] INTEGER NOT NULL,
		[TitleID] INTEGER NOT NULL,
		[Password] CHAR(64) NOT NULL,
		[ProfileImage] IMAGE,
		[SignedUpDate] DATE NOT NULL,
		[LastStatusDate] DATE,

		CONSTRAINT PK_PersonID PRIMARY KEY (PersonID),
		CONSTRAINT FK_TitleID FOREIGN KEY(TitleID) REFERENCES [PERSON_TITLE](TitleID),
		CONSTRAINT FK_Person_Project FOREIGN KEY (ProjectID) REFERENCES [PROJECT]([ProjectID])
	);

