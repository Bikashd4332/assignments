USE [AdventureWorks2012];
GO

/* COUNT OF PERSON WITH A VALID SUFFIX */
SELECT COUNT(*) AS EMPLOYEES_WITH_VALID_SUFFIX FROM [PERSON].[PERSON] WHERE [Suffix] IN ('Sr.', 'Jr.', 'Phd');
GO

/* LISTING THE FULL NAMES OF PEOPLE WHO LIVE IN FLORIDA */

SELECT EMPLOYEE_DETAILS.EMP_NAME , EMPLOYEE_DETAILS.City FROM  ---Filtering with city name
		( SELECT EMP.EMP_NAME, EMP_ADD.CITY FROM --- Joining with the address table with addressId to get the city names.
			( SELECT CONCAT(P.FirstName, ' ', P.MiddleName, ' ', P.LastName) AS EMP_NAME, --- Joining the person table with the BusinessEntityAddress to get PersonNames and AddressId
			  A.AddressID   
			  FROM [PERSON].[PERSON] P INNER JOIN [PERSON].[BusinessEntityAddress] A  
			  ON P.[BusinessEntityID] = A.[BusinessEntityID]
			) EMP INNER JOIN [Person].[Address] EMP_ADD 
			ON EMP.AddressID = EMP_ADD.AddressID
		) EMPLOYEE_DETAILS WHERE EMPLOYEE_DETAILS.City LIKE 'F%'



/* LISTING ALL THE SalesOrderId, UnitPrice AND PRODUCT_NAME FOR ALL SINGLE QUANTITY ORDERS. */

SELECT  OD.SalesOrderId, OD.UnitPrice, P.Name FROM 
	( SELECT [SalesOrderId], [UnitPrice], [ProductID]
	  FROM [Sales].[SalesOrderDetail]
		WHERE [OrderQty] = 1
	) OD INNER JOIN [Production].[Product] P
	ON OD.ProductID = P.ProductID;

/*LISTING THE PRODUCT DESCRIPTION FOR CULTURE 'fr' FOR PRODUCT 736 USING ONLY SUBQUERY */

SELECT PD.Description FROM [Production].[ProductDescription] PD 
	WHERE PD.ProductDescriptionID = 
	( SELECT P.ProductDescriptionID 
	  FROM [Production].[ProductModelProductDescriptionCulture] P 
		WHERE P.CultureID = 'fr' 
		AND 
		P.ProductModelID = (SELECT ProductModelID FROM [Production].Product WHERE ProductID = 736)
	)

/* DOING THE SAME BUT USING ONLY JOIN */

SELECT PD.Description FROM [Production].[ProductDescription] PD 
	INNER JOIN 
	( SELECT PMPD.ProductDescriptionID 
	  FROM [Production].[Product] P 
	  INNER JOIN 
	  [Production].ProductModelProductDescriptionCulture PMPD 
	  ON P.ProductModelID = PMPD.ProductModelID 
		WHERE P.ProductID = 736 AND PMPD.CultureID = 'fr' 
	) PDID
	ON PDID.ProductDescriptionID = PD.ProductDescriptionID;


/* LISTING LISTPRICE,  ORDER QUANTITY AND THE NAME OF PRODUCT PURCHASED BY CUSTOMER ID 635 */

SELECT SOD.OrderQty, P.ListPrice, P.Name  
	FROM 
	[Sales].[SalesOrderHeader] SOH 
	INNER JOIN 
	[Sales].[SalesOrderDetail] SOD 
	ON 
	SOH.SalesOrderID = SOD.SalesOrderID  
	INNER JOIN 
	[Production].[Product] P 
	ON  SOD.ProductID = P.ProductID
	WHERE SOH.CustomerID = 635;

/* SELECTING THE PRODUCT OF WHICH ARE SUBCATEGORY OF 'Cranksets' AND SOLD IN THE CITY LONDON. */

SELECT COUNT(BillToAddressID) AS COUNT_OF_PRODUCT_SOLD_IN_LONDON FROM [Sales].[SalesOrderHeader] 
	WHERE SalesOrderID IN 
	( 
		SELECT SalesOrderId FROM [Sales].SalesOrderDetail 
			WHERE ProductID IN 
			( 
				SELECT ProductID FROM  [Production].Product 
				WHERE ProductSubcategoryID = 
					( SELECT ProductSubcategoryID FROM [Production].ProductSubcategory WHERE Name LIKE 'Crank%' )
			)
	) AND 
	BillToAddressID IN 
	(
		SELECT AddressId FROM [Person].Address WHERE City LIKE 'London' 
	);

/* DESCRIBING THE NCHAR, VARCHAR, NVARCHAR 
CHAR, VARCHAR --- Are the datatypes supported in all the DBMS for storing CHARACTER values or strings. 
			  --- These dataypes take integer argument for defining length of string they can have.
CHAR --- This datatype statically allocates space for its string.
VARCHAR --- This datatype contrary to CHAR is used for dynamic allocation of space for the string.

NCHAR, NVARCHAR --- This is the datatype specific to T-SQL which is for containing unicode string.
NCHAR --- This datatype as CHAR statically allocates memory for unicode string.
NVARCHAR --- This datatype as VARCHAR dynamically allocates memory for unicode string.

*/