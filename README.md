# Udacity Cloud Developer Nanodegree Capstone

I use option 2 in Project Rubric.

It is a Serverless web application

Udacity Capstone Requirements

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

You can Create, update, delete and filter order by name
Paginating  dynamoDB use LastEvaluatedKey 



I. Use Postman

use Postman colectton Capstone_Udacity_TamHV2.postman_collection.json
![Filter postman](Images/postman.png)

1. Filter Order
    - filter by name
![Filter by name](Images/filterByName.png)
    - User LastEvaluatedKey
![Filter use LastEvaluatedKey](Images/Filter1.png)
![Filter use LastEvaluatedKey2](Images/filter2.png)

2. Create Order

![Create Order](Images/CreateOrder.png)

3. Update Order
![Update Order](Images/update.png)

4. Delete order
![Update Order](Images/Delete.png)

5. Get Url
![Update Order](Images/GetUploadUrl.png)

II. Run app

cd Client
npm start
1. login
![Update Order](Images/App1.png)
![Update Order](Images/App2.png)
![Update Order](Images/App3.png)
2. Filter
![Update Order](Images/App4.png)
![Update Order](Images/App5.png)
3. New Order
![Update Order](Images/NewOrder1.png)
![Update Order](Images/NewOrder2.png)
![Update Order](Images/App6.png)
![Update Order](Images/App7.png)
4. Delete
![Update Order](Images/App8.png)
![Update Order](Images/App9.png)
![Update Order](Images/App10.png)

5. Upload
![Update Order](Images/App11.png)
![Update Order](Images/App12.png)
![Update Order](Images/App13.png)
![Update Order](Images/App14.png)