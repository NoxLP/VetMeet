# VetWeb
## Description

Second project of [Reboot Full Stack Web Developer bootcamp](https://www.reboot.academy/bootcamps/) consisting in a web app to manage  
consultations/meetings between veterinary  clinics and a freelance ophthalmologist specialist veterinary.

A REST API is exposed in the back using express, which manage the front requests  
to retrieve the data from a non relational [Mongo Atlas database](https://www.mongodb.com/cloud/atlas/), using mongoose to map the data.

The front is mainly bootstrap, with axios to send requests to the back.

All is mixed up with javascript ES6 and html5, among other utilities that you can find on [npm](https://www.npmjs.com/) like bcrypt,   
cors, helmet, dotenv, jsonwebtoken and morgan.

The page and web app is currently deployed on [Heroku](https://heroku.com), [here](https://vet-meet.herokuapp.com/) (only mobile version yet, you know, mobile first and what not).

## Installation
Simple enough, run `npm install` in your console and you're ready to go.

## Database model
As said before, the database used is [non relational MongoDB database](https://www.mongodb.com/).

The model consists on the 4 collections described below:

### Users:
| Field | Type |
|-------|------|
|name|String|
|email|String|
|password|String|
|role|String|
|createdAt|Number(timestamp)|

### Clinics:
| Field | Type |
|-------|------|
|name|String|
|email|String|
|password|String|
|address|String|
|telephone|Number|
|contactPerson|String|
|patients|[ObjectId](patients ref array)|
|createdAt|Number(timestamp)|

### Patients:
| Field | Type |
|-------|------|
|name|String|
|species|String|
|history|String|
|clinics|[ObjectId](clinics ref array)|
|meetings|[ObjectId](meetings ref array)|
|createdAt|Number(timestamp)|

### Meetings:
| Field | Type |
|-------|------|
|date|Date|
|disease|String|
|surgery|String|
|treatment|String|
|notes|String|
|done|Boolean|
|confirmed|Boolean|
|clinic|ObjectId|
|patient|ObjectId|
|createdAt|Number(timestamp)|

There are some DTOs too that are used along the app witch includes the following 
fields:

- ### Patient DTOs
    Name, species, history, createdAt
- ### Meeting date DTOs
    Date
- ### Filter DTOs
    - Meetings: \_id, date, disease, surgery, confirmed, done
    - Patients: name, species

## API endpoints @ 11.02.2021
All the endpoints are preceeded by `/api`.

- ### Auth
|Verb|Route|Description|
|-|-|-|
|POST|**/auth/users/login** |Typical log in with data in the body.<a name="fn1"><sup>1</sup></a>
|POST|**/auth/users/signup**|More typical sign up with data in the body.<a name="fn1"><sup>1</sup></a>
|POST|**/auth/clinics/login** |Typical log in with data in the body.
|POST|**/auth/clinics/signup**|More typical sign up with data in the body.|
|POST|**/auth/clinics/googleLogin**|Login/signup with google. Google token should be provided in the body.

## 

The endpoints below require to be authenticated as user.

- ### Users (requires to be authenticated as user)
|Done|Verb|Route|Description|Auth.
|-|-|-|-|-|
| :heavy_check_mark: |GET|**/users/me**|Get current authenticated user's data<a name="fn1"><sup>1</sup></a>|User
| :heavy_check_mark: |GET|**/users/userId**|Get user data by id<a name="fn1"><sup>1</sup></a>|Admin user
| :heavy_check_mark: |GET|**/users**|Get all users data<a name="fn1"><sup>1</sup></a>|Admin user
| :heavy_check_mark: |PUT|**/users/me**|Update current authenticated user's data<a name="fn1"><sup>1</sup></a>|User
| :heavy_check_mark: |PUT|**/users/userId**|Update user data by id<a name="fn1"><sup>1</sup></a>|Admin user
| |PUT|**/users/userEmail**|Update user data by email<a name="fn1"><sup>1</sup></a>|Admin user
| :heavy_check_mark: |DELETE|**/users/userId**|Delete an user by id<a name="fn1"><sup>1</sup></a>|Admin user
| |DELETE|**/users/userEmail**|Delete an user by email<a name="fn1"><sup>1</sup></a>|Admin user


## 

All the endpoints below require to be authenticated as clinic, exceptions are indicated.

Where possible, pagination ("Pag.") is used with limit and page. You know how it goes: limit are the items per page, page is the page to get from 0 to whatever.


- ### Clinics
|Verb|Route|Description|
|-|-|-|
|GET|**/clinics/me**|Get current authenticated user's data|
|PUT|**/clinics/me**|Update current authenticated user's data|

- ### Patients
|Done|Verb|Route|Description|Pag.|Auth.
|-|-|-|-|-|-|
| :heavy_check_mark: |GET|**/patients/dtos**|Get all *Patient DTO* objects|Yes|
| :heavy_check_mark: |POST|**/patients**|Create new patient with data patient's name in the body| |User or clinic
||PUT|**/patients/patientId**|Update patient with id in the parameter with data in the body(maybe will be omitted, since the patient can be updated in other ways)
||DELETE|**/patients/patientId**|Remove patient with id in the parameter


- ### Meetings
|Verb|Route|Description|Pag.|Auth.|
|-|-|-|-|-|
|GET|**/meetings/dtos/date**|Get all *Meeting date DTO* objects|Yes|User or clinic
|GET|**/meetings/dtos/filter**|Get query filtered *Meetings/Patients filter DTO* objects|Yes
|GET|**/meetings/meetingId**|Get meeting and meeting's patient data to show meeting file||User or clinic
|POST|**/meetings**|Create new meeting with data in the body
|PUT|**/meetings/meetingId**|Update showing file meeting and meeting's patient data
|DELETE|**/meetings/meetingId**|Remove meeting by id

# 

That's all, enjoy.

---
<sup>[1](#fn1)</sup>: These endpoints has no access from public web page (front) right now... maybe later.
