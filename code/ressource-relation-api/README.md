# Ressource relation system

## How to create a serverless API with MySQL

This project was created following the instructions provided at this url: https://hackernoon.com/a-crash-course-on-serverless-with-aws-building-apis-with-lambda-and-aurora-serverless-49885c46e37a

## To run the project locally

### Dependencies

#### Local dev only

- docker: https://docs.docker.com/install/linux/docker-ce/ubuntu/

#### Dependencies

- nodejs (v12.x): https://github.com/nvm-sh/nvm#installing-and-updating
- serverless framework cli: https://serverless.com/framework/docs/getting-started#installing-via-npm
- configure aws credentials: https://serverless.com/framework/docs/providers/aws/guide/credentials/

### Local Installation

- Spin up a mysql 5 docker container with info mirroring your secrets.json file:

```
npm run database:offline
```

- Install project

```
npm i
```

- Create a copy of sample.secrets.json called secrets.json to contain project variables

```
cp sample.secrets.json secrets.json
```

- Enter the following command at root of project to run

```
npm run all:offline
```

- Connecting to the database manually to inspect and drop tables when required by orm modifications

```
mysql -h 127.0.0.1 -P 3306 --protocol=tcp -u root -p
```

- A description of database objects shoud appear when you visit localhost:3000

```
curl localhost:3000
```

### Deployment

- Create a MySql amazon Aurora database throught the aws console with desired settings

- Create a secrets.json file containing it's information from RDS/Databases/id-of-database-cluster

```JSON
{
  "DB_HOST": "127.0.0.1", // Endpoint
  "DB_NAME": "test", // DB name
  "DB_PASSWORD": "root", // Master password
  "DB_PORT": 3306, // Port
  "DB_USER": "root", // Master username
  "NODE_ENV": "dev",
  "REGION": "ca-central-1", // Region & AZ
  "SECURITY_GROUP_ID": "sg-xx", // VPC security groups
  "SUBNET1_ID": "subnet-xx", // Subnets[0]
  "SUBNET2_ID": "subnet-xx" // Subnets[1]
}
```

- Enter the following command at root of project to deploy

```
npm run all:deploy
```

- The routes to access you project should appear in the terminal

```
curl https://*.execute-api.ca-central-1.amazonaws.com/dev/
/**
 * @apiDefine CollectionParam
 * @apiParam {integer} Id
 * @apiParam {string} Title
 * @apiParam {string} Description
 * @apiParam {integer} PopularityIndex
 * @apiParam {date} createdAt
 * @apiParam {date} updatedAt
 */
/**
...
```

Outputs:
