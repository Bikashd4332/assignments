USE DB_BTS;

CREATE TABLE [Project_Admin_Mapping]
	(
		[MappingID] INTEGER NOT NULL,
		[ProjectID] INTEGER NOT NULL,
		[AdminID] INTEGER NOT NULL,
		CONSTRAINT PK_MappingID PRIMARY KEY (MappingID),
		CONSTRAINT FK_ProjectID FOREIGN KEY (ProjectID) REFERENCES [Project]([ProjectID]),
		CONSTRAINT FK_AdminID FOREIGN KEY (AdminID) REFERENCES [Admin]([AdminID])
	)