USE DB_BTS;

CREATE TABLE [PERSON_TITLE]
	(
		[TitleID] INTEGER IDENTITY(1, 1) NOT NULL,
		[Name] VARCHAR(50) NOT NULL UNIQUE,
		[Description] VARCHAR(200) NOT NULL,
		CONSTRAINT PK_TitleID PRIMARY KEY (TitleID)
	);