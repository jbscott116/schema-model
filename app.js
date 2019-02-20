const Model = require('./Model')

const BASE_MODEL = {
    name: String,
    contact: {
        first: String,
        last: String,
        id: Number,
        stuff: {
            phone: Number,
            phoneExtension: Boolean
        }
    }
}

var properties = {
    name: 'Jacob Scott',
    contact: {
        first: 'Jacob',
        last: 'Scott',
        stuff: {
            phone: '564654645'
        }
    }
}

var appendSchema = {
    email: String,
    location: {
        address: String,
        country: String,
        city: String,
        zip: Number,
        state: String
    }
}

var myModel = new Model(BASE_MODEL)
myModel.clear()
console.log(myModel.model)

myModel.apply(properties)
console.log(myModel.model)

console.log('\nShould return blank model')
console.log(myModel.blank)

console.log('\nShould not be blank')
console.log(myModel.model)

console.log('\nSchema')
console.log(myModel.schema)

console.log('\nAppend Schema')
myModel.appendSchema(appendSchema)
console.log(myModel.schema)

console.log('\nFlatten')
console.log(myModel.flatten())