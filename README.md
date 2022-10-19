# Udacity Cloud Developer Nanodegree Capstone

I use option 2
It is a Serverless web application

You can Create, update, delete and filter order by name
Paginating  dynamoDB use LastEvaluatedKey 

Use PostMan
Functiona
1. Filter Order
    - filter by name
![Filter by name](Images/filter by name.png)
    - User LastEvaluatedKey
![Filter by name](Images/Filter1.png)
![Filter by name](Images/Filter2.png)

Udacity Capstone Requirements

https://github.com/aristha/Capstone_Udacity/blob/074d06339d72c8dfc15cef692bb7f23705adb929/Images/filter2.png
 - Functionality
    + A user of the web application can use the interface to create, delete and complete an item.
    + A user of the web interface can click on a "pencil" button, then select and upload a file. A file should appear in the list of items on the home page.
    + If you log out from a current user and log in as a different user, the application should not show items created by the first account.
    + A user needs to authenticate in order to use an application.

- Codebase
    + Code of Lambda functions is split into multiple files/classes. The business logic of an application is separated from code for database access, file storage, and code related to AWS Lambda.
    + To get results of asynchronous operations, a student is using async/await constructs instead of passing callbacks.

- Best practices
    + All resources needed by an application are defined in the "serverless.yml". A developer does not need to create them manually using AWS console.
    + Instead of defining all permissions under provider/iamRoleStatements, permissions are defined per function in the functions section of the "serverless.yml".
    + Application has at least some of the following:
        Distributed tracing is enabled
        It has a sufficient amount of log statements
        It generates application level metrics
    + Incoming HTTP requests are validated either in Lambda handlers or using request validation in API Gateway. The latter can be done either using the serverless-reqvalidator-plugin or by providing request schemas in function definitions.

- Architecture
    + 1:M (1 to many) relationship between users and items is modeled using a DynamoDB table that has a composite key with both partition and sort keys. Should be defined similar to this:
        KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    + Items are fetched using the "query()" method and not "scan()" method (which is less efficient on large datasets)