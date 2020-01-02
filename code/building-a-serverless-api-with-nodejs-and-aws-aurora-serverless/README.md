# How to create a serverless API with MySQL
This project was created following the instructions provided at this url: https://hackernoon.com/a-crash-course-on-serverless-with-aws-building-apis-with-lambda-and-aurora-serverless-49885c46e37a

# To run the project locally

1. Spin up a mysql 5 docker container with info mirroring your secrets.json file:

```
sudo docker run -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=test -e MYSQL_USER=root -d mysql:5
```

2. Enter the following command at root of project

```
npm run offline
```
