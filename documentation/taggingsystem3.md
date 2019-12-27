# Tagging System

## Architecture

![architecture 1](./assets/images/taggingsystem3/architecture1.png)

## Structure

### S3 Bucket Structure

#### File

```javascript
file = {
    content: File,
    systemMetadata: {
        versionID: String,
    }
    userDefinedMetadata: {
        ...
        geoLocationUrl: String // points to geoLocationBucket entry
        fileFormat: String // this files format ex: csv, png
    }
}
```

#### Geo Location

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

### dynamodb

#### Tag

```javascript
tag = {
    id: String,
    title: String,
    atlernativeTitles: [String],
    description: String,
    area: String, // url to area OPTIONAL
} // (ottawa, water)
```
#### TagRelation

```javascript
tagRelation = {
    id: String,
    referenceid: String, // reference to tag from tag table
    popularityIndex: Number, // increments each time we get a click with it as a filter
    reference: {
        url: String, // (file, collection or location url)
        type: String, // (file, collection or location)
    }
}
```

#### Collection

```javascript
collection = {
    id: String,
    title: String,
    description: String,
    area: String, // url to area OPTIONAL
} // ( mountains, rivers, cities, different file formats for same file )
```

#### CollectionRelation

```javascript
CollectionRelation = {
    id: String,
    referenceid: String, // reference to collection from collection table
    reference: {
        url: String, // (file, collection or location url)
        type: String, // (file, collection or location)
    }
} 
```