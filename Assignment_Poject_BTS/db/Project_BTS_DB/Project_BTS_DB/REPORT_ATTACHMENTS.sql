USE DB_BTS;

CREATE TABLE [REPORT_ATTACHMENTS]
	(
		[AttachmentID] INTEGER IDENTITY(1, 1),
		[ReportID] INTEGER NOT NULL,
		[Attachment] VARCHAR(50) NOT NULL,
		[DateAttached] DATETIME NOT NULL,

		CONSTRAINT PK_AttachmentID PRIMARY KEY (AttachmentID),
		CONSTRAINT FK_Report_Attachments_Report FOREIGN KEY (ReportID) REFERENCES REPORT_INFO(ReportID)
	);