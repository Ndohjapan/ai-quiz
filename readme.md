# AI Generated Quiz App with Nodejs and PostgreSQL

## Note
This is a straightforward project to assess my proficiency in using PostgreSQL after obtaining a certification in it. I want to emphasize that I specialize more in developing the backend of applications rather than the frontend, so the user interface of the project may not look very attractive.

## Overview
- Create a quiz which will generate a unique Quiz ID
- Join a quiz already created using the unique Quiz ID

The app is already hosted on 
~~~
https://ai-quiz.up.railway.app/
~~~

## How To Setup 

### Clone the repository
~~~ 
git clone https://github.com/Ndohjapan/ai-quiz.git
~~~

### Setup the environment variables
Create an environment file called `.env`
~~~
PORT=3030
HOST="localhost"
URL="localhost:3030"
POSTGRESS_PORT=5432
DATABASE="quizapp"
USER="postgres"
PASSWORD="12345678"
NODE_ENV="development"
POSTMARK_KEY="postmark secret key"
OTP_MINUTES_LIMIT="10"
SENDER_EMAIL="postmark verified sender email"
JWT_PRIVATE_KEY="random string"
SALT_SEED="random string"
OPENAI_API_KEY="open ai secret key" 
~~~

You can comment out line 39 in `authController.js` if you do not have a postmark account
~~~
// await sendMail(email, otp);
~~~

### Install Modules
~~~
npm install
~~~

### Start the Application
~~~
npm start
~~~

### Open Application
~~~
localhost:3030
~~~

## Demo
 
https://user-images.githubusercontent.com/40809813/220385831-12f58719-8ad3-43f4-ac69-881514296cce.mp4



