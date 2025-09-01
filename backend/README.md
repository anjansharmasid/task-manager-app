System requirements:
- GIT client
- Java 17 +
- Maven 3.5


How to install the application:
- Change location to where pom.xml is present
- command to compile: mvn clean install
- command to run:
  -  mvn clean package
  -  java -jar target/task-manager-1.0.0.jar 


How to use these REST APIs:
Use any REST API client with the example urls and sample payload.


Base URL: http://localhost:8080/api/tasks
Authentication :No authentication is required for this API (development version).

API Endpoints

1. Get All Tasks
   Retrieve a list of all tasks.
   URL: /
   Method: GET
   Success Response: 200 OK
   Error Response: 500 Internal Server Error

   EX: curl -X GET http://localhost:8080/api/tasks

2. Get Task by ID
   Retrieve a specific task by its UUID.
   URL: /{id}
   Method: GET
   URL Parameters: id (UUID) - The task identifier
   Success Response: 200 OK
   Error Response: 404 Not Found if task doesn't exist

   EX: curl -X GET http://localhost:8080/api/tasks/123e4567-e89b-12d3-a456-426614174000


3. Create a New Task
   Create a new task with validation.
   URL: /
   Method: POST
   Headers: Content-Type: application/json
   Success Response: 201 Created
   Error Response: 400 Bad Request for validation errors
   Request Body:
   {
   "title": "New Task Title",
   "description": "Optional task description",
   "status": "pending",
   "dueDate": "2026-12-31T23:59:59"
   }
   Required Fields:
   title (string, 3-100 characters) - Task title
   dueDate (ISO datetime) - Due date (must be in future)
   Optional Fields:
   description (string, max 1000 characters)
   status (string) - Defaults to "pending"

   Valid Status Values:
   pending
   in-progress
   completed

   EX: curl -X POST http://localhost:8080/api/tasks \
   -H "Content-Type: application/json" \
   -d '{
   "title": "Learn Spring Boot",
   "description": "Complete Spring Boot tutorial",
   "status": "in-progress",
   "dueDate": "2026-12-25T18:00:00"
   }'


4. Update Entire Task
   Update all fields of an existing task.
   URL: /{id}
   Method: PUT
   Headers: Content-Type: application/json
   URL Parameters: id (UUID) - The task identifier
   Success Response: 200 OK
   Error Responses:
   400 Bad Request for validation errors
   404 Not Found if task doesn't exist
   Request Body:
   {
   "title": "Updated Task Title",
   "description": "Updated description",
   "status": "completed",
   "dueDate": "2025-12-20T12:00:00"
   }
   
5. EX: curl -X PUT http://localhost:8080/api/tasks/123e4567-e89b-12d3-a456-426614174000 \
   -H "Content-Type: application/json" \
   -d '{
   "title": "Updated Task Title",
   "description": "Updated description",
   "status": "completed",
   "dueDate": "2025-12-20T12:00:00"
   }'

6. Update Task Status Only
   Update only the status of a task.
   URL: /{id}/status
   Method: PATCH
   Query Parameters: status (string) - New status value
   URL Parameters: id (UUID) - The task identifier
   Success Response: 200 OK

   Error Responses:
   400 Bad Request for invalid status
   404 Not Found if task doesn't exist

   Valid Status Values:
     pending
     in-progress
     completed

    EX:curl -X PATCH "http://localhost:8080/api/tasks/123e4567-e89b-12d3-a456-426614174000/status?status=completed"



7. Delete a Task
   Delete a specific task by its UUID.
   URL: /{id}
   Method: DELETE
   URL Parameters: id (UUID) - The task identifier
   Success Response: 200 OK
   Error Response: 404 Not Found if task doesn't exist

   EX:curl -X DELETE http://localhost:8080/api/tasks/123e4567-e89b-12d3-a456-426614174000


   Error Responses
   Validation Error (400 Bad Request)  
   {
   "timestamp": "2023-12-16T10:30:00.123456",
   "status": 400,
   "error": "Validation Failed",
   "message": "One or more fields have validation errors",
   "path": "/api/tasks",
   "fieldErrors": [
   {
   "field": "title",
   "message": "Title is required and cannot be empty",
   "rejectedValue": ""
   },
   {
   "field": "dueDate",
   "message": "Due date must be in the future",
   "rejectedValue": "2022-01-01T00:00:00"
   }
   ]
   }

   Not Found Error (404 Not Found)
   {
   "timestamp": "2023-12-16T10:30:00.123456",
   "status": 404,
   "error": "Resource Not Found",
   "message": "Task not found with id: '123e4567-e89b-12d3-a456-426614174000'",
   "path": "/api/tasks/123e4567-e89b-12d3-a456-426614174000"
   }

   Invalid Status Error (400 Bad Request)
   {
   "timestamp": "2023-12-16T10:30:00.123456",
   "status": 400,
   "error": "Invalid Argument",
   "message": "Invalid status value. Must be one of: pending, in-progress, completed",
   "path": "/api/tasks/123e4567-e89b-12d3-a456-426614174000/status"
   }
