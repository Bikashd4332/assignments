USE DB_BTS;

CREATE TABLE [User_Login_Details]
	(
		[LoginID] INTEGER NOT NULL,
		[UserID] INTEGER NOT NULL,
		[LastActvity] DATE NOT NULL,
		CONSTRAINT PK_LoginID PRIMARY KEY (LoginID),
		CONSTRAINT FK_User_Login_Details_UserID FOREIGN KEY (UserID) REFERENCES [User](UserID)
	);
