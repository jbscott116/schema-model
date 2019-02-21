# object-schema-model
Safely apply nested object data to a model based on a predefined schema. The primary use of this package is to enforce data integrity before inserting or updating data in a database. It's quite usefule for NoSQL databases, such as MongoDB, Firestore, or DynamoDB.

**Note:** this package should not be used in production environments yet. It's still in its early stages. Feel free to experiment though.

# Installing
Download from NPM
```
npm install object-schema-model
```
Add it to your project
```
const SchemaModel = require('object-schema-model')
```

# Guide
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
Instantiate a SchemaModel class with your schema.
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

## Defining schemas for Array items
Array items can be passed through SchemaModel instances as well. Define array item schemas by adding a SchemaModel instance within an Array.
```
var SCHEMA = {
    characters: [new SchemaModel({
        name: String,
        number: Number,
        movie: String
    })]
}
var myModel = new SchemaModel(SCHEMA)
```
The items within any arrays that are applied to `myModel` will be passed through the defined SchemaModel instance to enforce data integrity. 

## Set default model values
When creating a new instance of SchemaModel, you can specify default model values that will override the internal defaults. For example, models that are Numbers will be set to _0_. By adding the _defaults_ parameter, you can change this to _5_.
```
var SCHEMA = {
    name: String,
    id: Number
}

var mySchemaModel = new SchemaModel(SCHEMA);
// mySchemaModel.model is {name: '', id: 0}

var withDefaults = new SchemaModel(SCHEMA, {name: 'Vader', id: 1})
// withDefaults.model is {name: 'Vader', id: 1}
```

# The SchemaModel class
## Properties
### model
The data model

### schema
The schema defined upon constructing the SchemaModel instance

### blank
The model in it's blank state

### itemSchemas
An object of SchemaModel instances used for array items.

## Methods
### constructor(schema)
Create a Schema Model
```
const SCHEMA = {...}
var mySchemaModel = new SchemaModel(SCHEMA)
```
### apply(properties, appendArrayItems)
Safely apply input data to the model. Returns the model.
#### Parameters
- inputData (Object) - Input data to be applied to the model
- appendArrayItems (Boolean) - Should array items be appended?
```
var inputData = {...}
mySchemaModel.apply(inputData, true)
```

### appendSchema(schema)
Append new schema properties to the SchemaModel instance
```
const NEW_SCHEMA
mySchemaModel.appendSchema(NEW_SCHEMA)
```

### clear()
Clear the model and reset the blank model. Returns the model.
```
mySchemaModel.clear()
```
