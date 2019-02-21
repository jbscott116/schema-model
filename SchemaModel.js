const defaultTypes = ['Object', 'String', 'Array', 'Number', 'Boolean', 'RegExp', 'Function', 'SchemaModel']

class SchemaModel {

    constructor(schema, defaults) {
        if (!schema)
            throw new Error('The schema argument must be provided.')
        if (!isObject(schema))
            throw new TypeError('The schema argument must be an Object.')

        this.blank = {}
        this.defaults = defaults || {}
        this.itemSchemas = {}
        this.model = {}
        this.schema = {}
        this.schema = Object.assign(this.schema, schema)
        this.clear(this.defaults)
        return this
    }

    /** @method clear() 
     * Resets the model to its blank state.
    */
    clear(defaults) {
        defaults = defaults || {};
        var self = this;
        var schemaKeys = Object.keys(this.schema);
        schemaKeys.forEach(function(key, i, arr) {
            var schemaModelValue = self.schema[key]
            if (isObject(schemaModelValue)) {
                var subModel = new SchemaModel(schemaModelValue)
                self.model[key] = subModel.clear()
                self.blank[key] = subModel.clear()
            }
            if (schemaModelValue === Object) {
                if (defaults[key] === undefined) {
                    self.model[key] = {}
                    self.blank[key] = {}
                } else {
                    if (defaults[key].constructor.name !== 'Object')
                        throw new TypeError('Default value for key ' + key + ' is not an Object')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue === String) {
                if (defaults[key] === undefined) {
                    self.model[key] = ''
                    self.blank[key] = ''
                } else {
                    if (defaults[key].constructor.name !== 'String')
                        throw new TypeError('Default value for key ' + key + ' is not a String')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue === Number) {
                if (defaults[key] === undefined) {
                    self.model[key] = 0
                    self.blank[key] = 0
                } else {
                    if (defaults[key].constructor.name !== 'Number')
                        throw new TypeError('Default value for key ' + key + ' is not a Number')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue === Boolean) {
                if (defaults[key] === undefined) {
                    self.model[key] = false
                    self.blank[key] = false
                } else {
                    if (defaults[key].constructor.name !== 'Boolean')
                        throw new TypeError('Default value for key ' + key + ' is not a Boolean')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue === Function) {
                if (defaults[key] === undefined) {
                    self.model[key] = null
                    self.blank[key] = null
                } else {
                    if (defaults[key].constructor.name !== 'Function')
                        throw new TypeError('Default value for key ' + key + ' is not a Function')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue === Array) {
                if (defaults[key] === undefined) {
                    self.model[key] = []
                    self.blank[key] = []
                } else {
                    if (defaults[key].constructor.name !== 'Array')
                        throw new TypeError('Default value for key ' + key + ' is not an Array')
                    self.model[key] = defaults[key]
                    self.blank[key] = defaults[key]
                }
            }
            if (schemaModelValue instanceof Array) {
                if (defaults[key] === undefined) {
                    if (schemaModelValue.length && schemaModelValue[0] instanceof SchemaModel) {
                        self.itemSchemas[key] = schemaModelValue[0]
                        self.schema[key] = Array
                        self.model[key] = []
                        self.blank[key] = []
                    }
                    else {
                        self.model[key] = []
                        self.blank[key] = []
                    }
                } else {
                    if (defaults[key].constructor.name !== 'Array')
                        throw new TypeError('Default value for key ' + key + ' is not an Array')
                    self.model[key] = defaults[key]
                    self.model[blank] = defaults[key]
                }
            }
            if (schemaModelValue && !defaultTypes.includes(schemaModelValue.constructor.name)) {
                console.log(schemaModelValue.constructor.name)
                if (defaults[key] === undefined) {
                    self.model[key] = null
                    self.blank[key] = null
                }
                else {
                    if (self.schemaModelValue.constructor.name !== defaults[key].constructor.name)
                        throw new TypeError('The default value for key ' + key + ' should be of type', self.schemaModelValue.constructor.name)
                    self.model[key] = defaults[key]
                    self.model[blank] = defaults[key]
                }
            }
        })

        return this.model;
    }

    /** @method apply(props) 
     * Applies properties of an input object to the model
     * @param props: Object of properties to apply to the model
    */
    apply(props, appendArrayItems) {
        if (!props)
            throw new Error('An object is required for the \'props\' argument!')
        if (!props instanceof Object)
            throw new Error('Props argument must be an Object!')
        if (Object.keys(props).length == 0)
            return this.model

        appendArrayItems = appendArrayItems || false;
        var self = this;
        var schemaKeys = Object.keys(this.schema)
        schemaKeys.forEach(function(key, i, arr) {
            var schemaModelValue = self.schema[key]
            var propValue = props[key];
            if (!isUndefined(propValue)) {

                // Object - Recursive property application
                if (isObject(schemaModelValue) && !(schemaModelValue instanceof Array)) {
                    var subModel = new SchemaModel(schemaModelValue)
                    self.model[key] = subModel.apply(propValue, appendArrayItems)
                }


                // String
                else if (schemaModelValue === String) {
                    if (!(propValue.toString || propValue instanceof String) || propValue instanceof Object)
                        throw new TypeError('Object property ' + key + ' of value, ' + propValue + ', must be a String or have a toString method.');
                    if (propValue instanceof Array)
                        throw new TypeError('Object property ' + key + ' is an Array. Arrays must be converted to Strings manually.')
                    self.model[key] = propValue.toString()
                }

                // Number
                else if (schemaModelValue === Number) {
                    if (isString(propValue)) {
                        if (Number.isNaN(parseInt(propValue)) || Number.isNaN(parseFloat(propValue)))
                            throw new TypeError('Failed to parseInt() on object property ' + key + ' , of value, ' + propValue + '.')
                        else {
                            if (isFloatString(propValue))
                                self.model[key] = parseFloat(propValue)
                            else
                                self.model[key] = parseInt(propValue)
                        }
                            
                    } 
                    else if (isNumber(propValue)) {
                        self.model[key] = propValue;
                    } else {
                        throw new TypeError('Object property ' + key + ' of value, ' + propValue + ', must be either a number or a string that may be parsed as a number.');
                    }
                }

                // Boolean
                else if (schemaModelValue === Boolean) {
                    self.model[key] = propValue ? true : false
                }

                // Function
                else if (schemaModelValue === Function) {
                    if (!(propValue instanceof Function))
                        throw new TypeError('Object property ' + key + ' of value, ' + propValue + ', must be a Function.')
                    self.model[key] = propValue
                }

                // Array
                else if (schemaModelValue === Array) {
                    if (!(propValue instanceof Array)) {
                        throw new TypeError('Object property ' + key + ' of value, ' + propValue + ', must be an Array.')
                    }
                    else {
                        if (!appendArrayItems)
                            self.model[key] = [];
                        
                        // Use an existing array item schema
                        if (self.itemSchemas[key]) {
                            propValue.forEach(function(item, i, arr) {
                                var itemModel = new SchemaModel(self.itemSchemas[key].schema, self.itemSchemas[key].defaults)
                                itemModel.apply(item, appendArrayItems)
                                self.model[key].push(itemModel.model)
                            })
                        }
                        // No array item schema exists 
                        else {
                            propValue.forEach(function(item, i, arr) {
                                self.model[key].push(item)
                            })
                        }
                    }
                }

                // Object - Direct copy
                else if (schemaModelValue === Object) {
                    self.model[key] = Object.assign(self.model[key], propValue)
                }
            }
        })

        return this.model
    }

    /* appendSchema(newSchema) {
        var self = this;
        var newSchemaKeys = Object.keys(newSchema)
        newSchemaKeys.forEach(function(key, i, arr) {
            self.schema[key] = newSchema[key];
        })
    } */

    /** @method readSchema()
     * Returns a human-readable string of the schema
     */
    /* readSchema() {
        return true
    } */

    /** @method flatten() 
     * Flattens the model
    */
    /* flatten() {
        return true
    } */
};

function isObject(value) {
    return value !== null && (typeof value == 'object') && value instanceof Object
}

function isUndefined(value) {
    return value == undefined
}

function isFunction(value) {
    return typeof value === 'function' && value instanceof Function
}

function isNumber(value) {
    return typeof value === 'number'
}

function isString(value) {
    return typeof value === 'string'
}

function isRegExp(value) {
    return value instanceof RegExp
}

function isBoolean(value) {
    return typeof value === 'boolean'
}

function Float() {
    return 0.0;
}

function Integer() {
    return 0;
}

function isFloatString(string) {
    return /(-?(\d)+(\.){1}(\d)+)/.test(string)
}

module.exports = SchemaModel;