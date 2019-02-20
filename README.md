# object-schema-model
Safely apply nested object data to a model based on a predefined schema.

*Note:* this package should not be used in production environments yet. It's still in its early stages. Feel free to experiment though.

# Installing
Download from NPM
```
npm install object-schema model
```
Add it to your project
```
const SchemaModel = require('object-schema-model')
```

# Getting Started
## Create a model schema
Schemas are defined by using type constructors within an object
```
const MY_SCHEMA = {
    username: String
    accountNumber: Number,
    contact: {
        first: String,
        last: String,
        email: String,
        phone: String
    },
    posts: Array
}
```

## Create your Schema Model
Instantiate a SchemaModel class with your schema
```
var mySchemaModel = new SchemaModel(MY_SCHEMA)
```

## Apply data to your model
Apply data to your model with the `.apply()` method. Pass in an object with the prroperties you would like to apply to the model. Make sure it matches the structure of your schema. Only the properties that are defined on the object will be applied to the model.
```
// Data matches the structure of the schema
var data = {
    username: 'darthVader',
    accountNumber: 1,
    contact: {
        first: 'Darth',
        last: 'Vader',
        email: 'vader@empire.org',
        phone: '5551234567'
    },
    post: [{
        title: 'How to conquer the galaxy',
        content: 'Lorem ipsum dolor sit amet...'
    }]
}

// Apply data to the model
mySchemaModel.apply(data)
```