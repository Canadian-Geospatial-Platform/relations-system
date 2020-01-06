# architecture

## Database system

It has been decided to use SQL as read only database replication, guaranteed integrity and automatic scaling (aurora) give us all the benefits of noSql, without requiring us to invest large efforts in maintaining integrity.

## Data modeling

See sequelize models in the project.

## Location data and actual data

The location data and actual file data and metadata will be store in amazon S3. This system needs only to manage relations between tags, collections and the actual files. Geolocation queries will be based on Amazon Athena.

## API structure

![API structure](../assets/images/architecture1.png)

## Future improvements

- It would be an options to offer certain filtering queries not linked to geospacial data directly from this API if we wish to rely less on Amazon Athena.
