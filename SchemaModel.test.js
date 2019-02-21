const SchemaModel = require('./SchemaModel')
var SCHEMA = {
    username: String,
    accountNumber: Number,
    passwordHash: String,
    contact: {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        location: {
            streetAddress: String,
            city: String,
            state: String,
            country: String,
            zip: String
        }
    },
    posts: Array,
    confirmed: Boolean,
}

const TYPE_SCHEMA = {
    number: Number,
    string: String,
    array: Array,
    object: Object,
    function: Function,
    boolean: Boolean,
    // float: Float,
    // integer: Integer
}

const TYPE_BLANK = {
    number: 0,
    string: '',
    array: [],
    object: {},
    function: null,
    boolean: false
}

const BLANK = {
    username: '',
    accountNumber: 0,
    passwordHash: '',
    contact: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: {
            streetAddress: '',
            city: '',
            state: '',
            country: '',
            zip: ''
        }
    },
    posts: [],
    confirmed: false
}

const ARRAY_MODEL_SCHEMA = {
    name: String,
    list: [new SchemaModel({
        car: Boolean,
        cat: Boolean,
        dog: Boolean
    })]
}

const DEEP_SCHEMA = {
    name: String,
    number: Number,
    contact: {
        first: String,
        last: String,
        phone: String
    },
    posts: [new SchemaModel({
        title: String,
        comments: [new SchemaModel({
            id: String,
            content: String
        })]
    })]
}

const FLOAT_STRING_SCHEMA = {
    float: Number,
    negativeFloat: Number
}

describe('SchemaModel', () => {
    describe ('constructor()', () => {
        test('constructs an instance of SchemaModel', () => {
            expect(new SchemaModel(SCHEMA)).toBeInstanceOf(SchemaModel)
        })
    
        test('throws an error when no schema is provided', () => {
            expect(() => {return new SchemaModel()}).toThrow();
        })
    
        test('builds the blank model', () => {
            var model = new SchemaModel(SCHEMA);
            expect(model.blank).toStrictEqual(BLANK)
        })
    })

    describe('Default values', () => {
        const DEFAULTS = {
            number: 5,
            string: 'Hello, world',
            array: ['Hello', 'World'],
            object: {hello: 'world'},
            boolean: true,
        }

        const INVALID_DEFAULTS = {
            number: 'd',
            string: 85,
            array: {invalid: 'type'}
        }

        var defaults = {}
        defaults = Object.assign(defaults, DEFAULTS);
        defaults.function = null;

        test('setting defaults in constructor throws no errors', () => {
            expect(() => {return new SchemaModel(TYPE_SCHEMA, DEFAULTS)}).not.toThrow()
        })
        test('blank matches defaults', () => {
            var schemaModel = new SchemaModel(TYPE_SCHEMA, DEFAULTS)
            expect(schemaModel.blank).toStrictEqual(defaults)
        })
        test('model matches defaults', () => {
            var schemaModel = new SchemaModel(TYPE_SCHEMA, DEFAULTS)
            expect(schemaModel.model).toStrictEqual(defaults)
        })
        test('throws errors when default type does not match schema type', () => {
            expect(() => {return new SchemaModel(TYPE_SCHEMA, INVALID_DEFAULTS)}).toThrow()
        })
    })

    describe('SchemaModel.clear()', () => {
        var model = new SchemaModel(SCHEMA)
        var properties = {
            username: 'scott89',
            contact: {
                firstName: 'Jacob',
                lastName: 'Scott',
                location: {
                    city: 'Fort Smith'
                }
            },
            confirmed: true
        }
        model.apply(properties)

        test('returns a valid blank model', () => {
            expect(model.clear()).toStrictEqual(BLANK)
        })
        test('return value matches blank property', () => {
            expect(model.clear()).toStrictEqual(model.blank)
        })
    })

    describe('apply(properties)', () => {
        var model = new SchemaModel(SCHEMA);
        var properties = {
            username: 'scott89',
            contact: {
                firstName: 'Jacob',
                lastName: 'Scott',
                location: {
                    city: 'Fort Smith'
                }
            },
            confirmed: true
        }
        var expected = {
            username: 'scott89',
            accountNumber: 0,
            passwordHash: '',
            contact: {
                firstName: 'Jacob',
                lastName: 'Scott',
                email: '',
                phone: '',
                location: {
                    streetAddress: '',
                    city: 'Fort Smith',
                    state: '',
                    country: '',
                    zip: ''
                }
            },
            posts: [],
            confirmed: true
        }

        test('throws an error when no properties object is given', () => {
            expect(() => {return model.apply()}).toThrow();
        })
        test('calling with {} empty object does not throw error', () => {
            expect(() => {return model.apply({})}).not.toThrow();
        })
        test('does not throw an error', () => {
            expect(() => {return model.apply(properties)}).not.toThrow()
        })
        test('model is mutated as expected', () => {
            expect(model.model).toStrictEqual(expected)
        })

        describe('Valid value types when applying', () => {
            var typeModel = new SchemaModel(TYPE_SCHEMA)
            test('valid number (parse string)', () => {
                expect(() => {return typeModel.apply({number: '5'})}).not.toThrow()
            })
            test('valid number (integer)', () => {
                expect(() => {return typeModel.apply({number: 5})}).not.toThrow()
            })
            test('valid number (float)', () => {
                expect(() => {return typeModel.apply({number: 5.5})}).not.toThrow()
            })
            test('valid string', () => {
                expect(() => {return typeModel.apply({string: 'x'})}).not.toThrow()
            })
            test('valid object', () => {
                expect(() => {return typeModel.apply({obejct: {}})}).not.toThrow()
            })
            test('valid array', () => {
                expect(() => {return typeModel.apply({array: []})}).not.toThrow()
            })
            test('valid function', () => {
                expect(() => {return typeModel.apply({function: function() {} })}).not.toThrow()
            })
            test('valid boolean (true)', () => {
                expect(() => {return typeModel.apply({boolean: true})}).not.toThrow()
            })
            test('valid boolean (false)', () => {
                expect(() => {return typeModel.apply({boolean: false})}).not.toThrow()
            })
            test('valid boolean (string)', () => {
                expect(() => {return typeModel.apply({boolean: 'valid' })}).not.toThrow()
            })
            test('valid boolean (1)', () => {
                expect(() => {return typeModel.apply({boolean: 1 })}).not.toThrow()
            })
            test('valid boolean (0)', () => {
                expect(() => {return typeModel.apply({boolean: 0 })}).not.toThrow()
            })
            test('valid boolean (array)', () => {
                expect(() => {return typeModel.apply({boolean: [] })}).not.toThrow()
            })
        })

        describe('TypeErrors when applying different value types', () => {
            var typeModel = new SchemaModel(TYPE_SCHEMA);
            test('invalid number (cannot parse)', () => {
                expect(() => {return typeModel.apply({number: 'x'})}).toThrow()
            })
            test('invalid number (invalid type)', () => {
                expect(() => {return typeModel.apply({number: []})}).toThrow()
            })
            test('invalid string (object)', () => {
                expect(() => {return typeModel.apply({string: {}})}).toThrow()
            })
            test('invalid string (array)', () => {
                expect(() => {return typeModel.apply({string: []})}).toThrow()
            })
            test('invalid array (string)', () => {
                expect(() => {return typeModel.apply({array: 'hello, world'})}).toThrow()
            })
            test('invalid function (string)', () => {
                expect(() => {return typeModel.apply({function: 'invalid' })}).toThrow()
            })
        })

        describe('String -> Number(float) conversions', () => {
            var floatModel = new SchemaModel(FLOAT_STRING_SCHEMA);
            var properties = {float: '6.7', negativeFloat: '-3.4'}
            test('throws no errors', () => {
                expect(() => {return floatModel.apply(properties)}).not.toThrow()
            })
            test('parses correct float value', () => {
                floatModel.apply(properties)
                expect(floatModel.model.float).toEqual(6.7)
            })
            test('parses correct negative float value', () => {
                expect(floatModel.model.negativeFloat).toEqual(-3.4)
            })
        })

        describe('Obeject references', () => {
            var schemaModel = new SchemaModel(SCHEMA)
            schemaModel.apply(properties)
            test('model and blank do not share references', () => {
                expect(schemaModel.model).not.toStrictEqual(schemaModel.blank)
            })
        })
    })

    describe('Schemas for array items', () => {
        describe('constructor()', () => {
            test('SchemaModel constructs successfully', () => {
                expect(() => {return new SchemaModel(ARRAY_MODEL_SCHEMA)}).not.toThrow();
            })
            test('SchemaModel contains arrayModel', () => {
                var myArrayModel = new SchemaModel(ARRAY_MODEL_SCHEMA)
                var expectedArraySchema = {
                    car: Boolean,
                    cat: Boolean,
                    dog: Boolean
                }
                
                expect(myArrayModel.itemSchemas.list).toBeDefined()
                expect(myArrayModel.itemSchemas.list).toBeInstanceOf(SchemaModel)
                expect(myArrayModel.itemSchemas.list.schema).toStrictEqual(expectedArraySchema)
            })
        })

        describe('apply()', () => {
            var myArrayModel = new SchemaModel(ARRAY_MODEL_SCHEMA)
            var properties = {
                name: 'dog',
                list: [
                    {dog: true, cat: false, car: true}
                ]
            }
            test('Applying arrayModel to array items throws no errors', () => {
                expect(() => {return myArrayModel.apply(properties)}).not.toThrow()
            })
            test('SchemaModel is applied as expected', () => {
                myArrayModel.apply(properties)
                expect(myArrayModel.model).toStrictEqual(properties)
            })
            test('Appending to existing array', () => {
                var newProps = {list: [{dog: true}]}
                myArrayModel.apply(newProps, true)
                expect(myArrayModel.model.list.length).toEqual(2)
            })
        })
    })

    describe('Deep schemas and array schemas', () => {
        describe('constructor()', () => {
            test('construting deep schema model throws no errors', () => {
                expect(() => {return new SchemaModel(DEEP_SCHEMA)}).not.toThrow();
            })
        })

        var deepModel = new SchemaModel(DEEP_SCHEMA)
        var properties = {
            name: 'Jacob Scott',
            number: 87,
            contact: {
                first: 'Jacob',
                last: 'Scott',
                phone: '5551234567'
            },
            posts: [
                {
                    title: 'example title',
                    comments: [
                        {
                            id: '464654',
                            content: 'Just another comment.'
                        }
                    ]
                }
            ]
        }

        var additionalPostsAndComments = {
            posts: [
                {
                    title: 'another post',
                    comments: [
                        {id: '561651', content: 'Yet another comment'}
                    ]
                }
            ]
        }
        
        describe('apply()', () => {
            test('applying to deep model throws no errors', () => {
                expect(() => {return deepModel.apply(properties)}).not.toThrow()
            })
            test('deep model is as expected', () => {
                var newDeepModel = new SchemaModel(DEEP_SCHEMA)
                newDeepModel.apply(properties)
                expect(newDeepModel.model).toStrictEqual(properties)
            })

            describe('appending to deeply nested arrays (doesn\'t work)', () => {
                var deepNestedArraysModel = new SchemaModel(DEEP_SCHEMA)
                deepNestedArraysModel.apply(properties)
                deepNestedArraysModel.apply(additionalPostsAndComments, true)
                test('top-level arrays are the expected length', () => {
                    expect(deepNestedArraysModel.model.posts.length).toEqual(2)
                })
                test('nested arrays are the expected length', () => {
                    expect(deepNestedArraysModel.model.posts[0].comments.length).toEqual(1)
                })
            })

            var yetAnotherModel = new SchemaModel(DEEP_SCHEMA)
            yetAnotherModel.apply(properties);
            var newComment = {
                id: 'newComment',
                content: 'lorem ipsum dolor sit amet'
            }
            describe('correct way of appending to deeply nested arrays', () => {
                var newCommentModel = new SchemaModel(yetAnotherModel.itemSchemas.posts.itemSchemas.comments.schema)
                newCommentModel.apply(newComment)
                yetAnotherModel.model.posts[0].comments.push(newCommentModel.model)
                yetAnotherModel.apply(yetAnotherModel.model)

                test('post[0].comments length is 2', () => {
                    expect(yetAnotherModel.model.posts[0].comments.length).toEqual(2)
                })
            })
        })

        describe('clear()', () => {
            var clearedModel = {
                name: '',
                number: 0,
                contact: {
                    first: '',
                    last: '',
                    phone: ''
                },
                posts: []
            }
            test('clears model as expected', () => {
                deepModel.clear()
                expect(deepModel.model).toStrictEqual(clearedModel)
            })
            test('model is the same as blank', () => {
                expect(deepModel.model).toStrictEqual(deepModel.blank)
            })
        })
    })
})
