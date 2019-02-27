USE ASSIGNMENT_DB;
GO

/* SELECT CLAUSE */

	SELECT COUNT(*) AS TOTAL_EMPLOYEES,
		 MIN([moSalary]) AS MINIMUM_SALARY,
		 COUNT(DISTINCT [ntLevel]) AS DISTINCT_NT_LEVELS 
	FROM [dbo].[tblEmp];
	GO

/* CORRECTING FORM CLAUSE */

	 SELECT 
		E.[ntEmpID],
		E.[vcName],
		E.[vcMobieNumer]
	FROM tblEmp E;
	GO


/* WHERE CLUASE (ASSUMING TO SELECT THE PERSONS WHO DON'T HAVE A CELLPHONE HOWEVER THEIR NTLEVEL IS 1 OR WHOSE NTLEVEL IS O) */ 

	SELECT * FROM [dbo].[tblEmp] 
		WHERE (
			[vcMobieNumer] IS NULL 
				AND 
			[ntLevel] = 1
			  ) 
		OR 
		[ntLevel] = 0;


/* ORDER BY CLAUSE */

	SELECT [ntEmpID], [vcName], [vcMobieNumer], [vcSkills], [moSalary], [ntLevel] 
		FROM (
		SELECT [ntEmpID], [vcName], [vcMobieNumer], [vcSkills], 
			(CASE 
				WHEN vcSkills LIKE '%JavaScript%' THEN 1 
				ELSE 0 
			END) AS devPriority,
			[moSalary],
			[ntLevel] 
		FROM [dbo].[tblEmp]
		) grossSelection ORDER BY devPriority DESC;

/* Explaining the top clause in the following */

	-- This query selects the top row present in the specified table by using the top 
	SELECT TOP(1) * FROM tblEmp; 

	--- In this the 3/2 is the first expression that gets evaluated and passed to the top which is 1.5. Excluding the decimal it becomes 1 so lists the first row
	SELECT TOP(SELECT 5/2) * FROM tblEmp  

	---This query increases the selection of rows when there exist duplicate right next to the last row. 
	---Even if the row count is not equal to the value passed to the top.
	SELECT TOP(1) WITH TIES * FROM tblEmp ORDER BY ntLevel DESC

	--- This query selects the 1% of row[s] from the table.
	SELECT TOP(50) PERCENT * FROM tblEmp 

/* GROUP BY / HAVING */

SELECT [vcName],[vcMobieNumer] FROM [dbo].[tblEmp] GROUP BY [vcName];
--- The problem here in this query is the name vcMobileNumber is not in the GROUP BY clause or not applied any aggregrate function to it.

	--- Soln. 1 solving throug grouping 
		SELECT [vcName],[vcMobieNumer] FROM [dbo].[tblEmp] GROUP BY [vcName], [vcMobieNumer]

	--- Soln. 2 solving through aggregate function
		SELECT [vcName], COUNT([vcMobieNumer]) FROM [dbo].[tblEmp] GROUP BY [vcName];


SELECT * FROM [dbo].[tblEmp] WHERE moSalary > (SELECT AVG(moSalary) FROM [dbo].[tblEmp]);