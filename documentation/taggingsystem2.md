# s3/dynamoDB tagging system

## Issues to take into account

### Storing of location data

s3 metadata fields are limited to 2 KB. Therefore the location data needs to be stored separately to the data. There a two storage options for the location data:

    1. s3
    2. dynamoDB

For this option, the location data will be stored in s3 files.

### Caching

Athena does not cache queries. However, we get an execution ID allows to retrieve the result of previous queries. If we can remember redundant queries and return cached queries we can prevent running expensive requests too often. 

### Offering multiple versions of the same file

It may be required to offer multiple formats of the same file. For this need, we could use collections.

## S3 Bucket Structure

### File Bucket

```javascript
file = {
    content: File,
    systemMetadata: {
        versionID: String,
    }
    userDefinedMetadata: {
        ...
        geoLocationUrl: String // points to geoLocationBucket entry
        fileFormats: String // collection
    }
}
```

### Geo Location Bucket

```javascript
file = {
    content: File, // geoLocationData
    systemMetadata: {
        versionID: String,
    }
    userDefinedMetadata: {
        title: String // Ex: Canada
        alternateTitles: [ String ] // Ex: Bas Canada, Haut Canada
        ...
        geoLocation: geoJson // Or desired format
    }
}
```

## Dynamodb Structure

It is to be noted that tag and collection objects share enought similarities to be merged. This could, however, be undesirable because of the size of the resulting table making certain queries potentially more expensive.

### Option 1: separate tag and collection

This option offers clear separations of concerns. But may cause redundancy and complexity due to it's similarities with collection.

#### Tag

```javascript
tag = {
    id: String,
    title: String,
    title_synonims: [String],
    description: String,
    references: [{
        type: String, // (file, collection, tag or location)
        url: String
        }]
    }
} // (ottawa)
```

#### Collection

```javascript
collection = {
    id: String,
    title: String,
    description: String,
    references: [{
        type: String, // (file, collection, tag or location)
        url: String
        }] // (files or collections)
    tags: [String] //tags table
} // (versions, part of set of quarterly reports)
```

### Option 2: merge collection and tag

This option could use secondary indexes to access the tag or collection subset quickly.

#### Collection

```javascript
collection = {
    id: String,
    title: String,
    title_alternatives: [String],
    description: String,
    type: String, // collection or tag
    references: [{
        type: String, // (file, collection, tag or location)
        url: String
        }] // (files or collections)
    tags: [String] //Collection table
} // (versions, part of set of quarterly reports)
```