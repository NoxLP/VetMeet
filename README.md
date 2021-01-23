# VetWeb
## Description

Second project of [Reboot Full Stack Web Developer bootcamp](https://www.reboot.academy/bootcamps/) consisting in a web app to manage  
consultations/meetings between veterinary  clinics and a freelance ophthalmologist specialist veterinary.

A REST API is exposed in the back using express, which manage the front requests  
to retrieve the data from a non relational [Mongo Atlas database](https://www.mongodb.com/cloud/atlas/), using mongoose to map the data.

The front is mainly bootstrap, with axios to send requests to the back.

All is mixed up with javascript ES6 and html5, among other utilities thath you can found on [npm](https://www.npmjs.com/) like bcrypt,   
cors, helmet, dotenv, jsonwebtoken and morgan.

The page and web app is deployed on [Heroku](https://heroku.com), [here]() (nah, not yet... waiting for the first release...).

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
|address|String|
|email|String|
|password|String|
|telephone|Number|
|contactPerson|String|
|createdAt|Number(timestamp)|

### Patients:
| Field | Type |
|-------|------|
|name|String|
|users|[ObjectId]|
|species|String|
|history|String|
|meetings|[ObjectId]|

### Meetings:
| Field | Type |
|-------|------|
|date|Date|
|user|ObjectId|
|patient|ObjectId|
|disease|String|
|surgery|String|
|treatment|String|
|notes|String|
|done|Boolean|
|confirmed|Boolean|

There are some DTOs too that are used along the app witch includes the following 
fields:

- ### Patient DTO
    Name, species, history
- ### Meeting date DTO
    Date
- ### Meetings/Patients filter DTO
    - Meetings: date, disease, surgery, confirmed, done
    - Patients: name, species

## Planned API endpoints @ 23.01.2021
All the endpoints are preceeded by `/api`.

- ### Auth
|Verb|Route|Description|
|-|-|-|
|POST| **/auth/users/login** |Typical log in with data in the body.
|POST|**/auth/users/signup**|More typical sign up with data in the body.
|POST| **/auth/clinics/login** |Typical log in with data in the body.
|POST|**/auth/clinics/signup**|More typical sign up with data in the body.|

## 

The endpoints below require to be authenticated as user.

- ### Users (requires to be authenticated as user)
|Verb|Route|Description|
|-|-|-|
|GET|**/users**|Get current authenticated user's data|
|PUT|**/users/userEmail**|Update current authenticated user's data|
|DELETE|**/users/userEmail**|Delete an user

## 

All the endpoints below require to be authenticated as clinic or user.

- ### Clinics
|Verb|Route|Description|
|-|-|-|
|GET|**/clinics**|Get current authenticated user's data|
|PUT|**/clinics**|Update current authenticated user's data|

- ### Patients
|Verb|Route|Description|Pag.|
|-|-|-|-|
|GET|**/patients/dtos**|Get all *Patient DTO* objects|Yes|
|POST|**/patients**|Create new patient with data patient's name in the body
|PUT|**/patients/patientId**|Update patient with id in the parameter with data in the body|
|DELETE|**/patients/patientId**|Remove patient with id in the parameter


- ### Meetings
|Verb|Route|Description|Pag.|
|-|-|-|-|
|GET|**/meetings/dtos/date**|Get all *Meeting date DTO* objects|Yes
|GET|**/meetings/dtos/filter**|Get query filtered *Meetings/Patients filter DTO* objects|Yes
|GET|**/meetings/patientId**|Get meeting and meeting's patient data to show meeting file
|POST|**/meetings**|Create new meeting with data in the body|
|PUT|**/meetings/meetingId/patients/patientId**|Update showing file meeting and meeting's patient data

# 

That's all, enjoy.
