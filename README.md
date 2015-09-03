# nodejs-rest-api-mysql
**A node.js API server for MySQL** - It can perform CRUD (Create, Read, Update, Delete) operations using HTTP Methods (POST, GET, PUT, and DELETE) for RESTful Services.

##Install
- Git Clone
- Perform `npm install`

##Configure
- Enter the database name, username and password for connecting to local mysql.
- Enter table prefix, if any.
- Start server by running `server.js` file
```javascript
var sequelize = new Sequelize('database', 'username', 'password');
var TABLE_PREFIX = "prefix_";
```

##Create (POST)
This method will create a new entry in the table with the paramaters that are posted.

```
POST http://www.example.com/api/table_name
```
**Response**
- If the row is created :
```json
{
  "success": 1,
  "id": inserted_id
}
```
- If parameters are missing :
```json
{
  "success": 0,
  "message": "Parameters missing"
}
```

##Read (GET)
Reads data from table.

- Read Entire Table
```
GET http://www.example.com/api/table_name
```
- Read by ID
```
GET http://www.example.com/api/table_name/id
```
**Response**
- If data exsists :
```json
{
  "success": 1,
  "data": "..."
}
```
- If data missing :
```json
{
  "success": 0,
  "message": "No rows found"
}
```

##Update (PUT)
This method will update an entry in the table with the paramaters that are put.

```
PUT http://www.example.com/api/table_name/id
```
**Response**
- If the row is updated :
```json
{
  "success": 1,
  "message": "Updated"
}
```
- If parameters are missing :
```json
{
  "success": 0,
  "message": "Parameters missing"
}
```

##Delete (DELETE)
This method will delete an entry in the table.

```
DELETE http://www.example.com/api/table_name/id
```
**Response**
- If the row is deleted :
```json
{
  "success": 1,
  "message": "Deleted"
}
```

##Thank you.
Arjun
