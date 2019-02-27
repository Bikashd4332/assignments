CREATE DATABASE ASSIGNMENT_DB;
GO

USE ASSIGNMENT_DB;
GO

CREATE TABLE [dbo].[tblEmp] (
    [ntEmpID] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
    [vcName] [varchar](100) NULL,
    [vcMobieNumer] [varchar](15) NULL,
    [vcSkills] [varchar](max) NULL,
    [moSalary] [money] DEFAULT(0) NOT NULL,
    [ntLevel] [bit] DEFAULT(0) NOT NULL
)
GO

--Inserting demo data
INSERT [dbo].[tblEmp] VALUES
    ('ScottD','123-456-3456','CF,HTML,JavaScript',50,0),
    ('Greg',NULL,'HTML5,JavaScript,Jquery',80,0),
    ('David','123-456-3458','Sql,JavaScript',30,1),
    ('Alan','123-456-3459','C#,VB,XQuery',60,1),
    ('Jhon',NULL,'XML,HTML',80,1),
    ('Alan','123-456-3461','Sql,Oracle,DB2',70,1)
GO      
