class Model {

    constructor(schema) {
        if (!schema)
            throw new Error('The schema argument must be provided.')
        if (!isObject(schema))
            throw new TypeError('The schema argument must be an Object.')

        this.itemSchemas = {}
        this.blank = {}
        this.schema = {}
        this.model = {}
        this.schema = Object.assign(this.schema, schema)
        this.model = this.clear()
        this.clear()
        return this
    }

    /** @method clear() 
     * Resets the model to its blank state.
    */
    clear() {
        var self = this;
        var schemaKeys = Object.keys(this.schema);
        schemaKeys.forEach(function(key, i, arr) {
            var schemaModelValue = self.schema[key]
            if (isObject(schemaModelValue)) {
                var subModel = new Model(schemaModelValue)
                self.model[key] = subModel.clear()
                self.blank[key] = subModel.clear()
            }
            if (schemaModelValue === Object) {
                self.model[key] = {}
                self.blank[key] = {}
            }
            if (schemaModelValue === String) {
                self.model[key] = ''
                self.blank[key] = ''
            }
            if (schemaModelValue === Number) {
                self.model[key] = 0
                self.blank[key] = 0
            }
            if (schemaModelValue === Boolean) {
                self.model[key] = false
                self.blank[key] = false
            }
            if (schemaModelValue === Function) {
                self.model[key] = null
                self.blank[key] = null
            }
            if (schemaModelValue === Array) {
                self.model[key] = []
                self.blank[key] = []
            }
            if (schemaModelValue === Float) {
                self.model[key] = 0.0
                self.blank[key] = 0.0
            }
            if (schemaModelValue === Integer) {
                self.model[key] = 0
                self.blank[key] = 0
            }
            if (schemaModelValue instanceof Array) {
                if (schemaModelValue.length && isObject(schemaModelValue[0]) && Object.keys(schemaModelValue[0]).length) {
                    self.itemSchemas[key] = new Model(schemaModelValue[0])
                    self.schema[key] = Array
                    self.model[key] = []
                    self.blank[key] = []
                }
                else {
                    self.model[key] = []
                    self.blank[key] = []
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
                    var subModel = new Model(schemaModelValue)
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
                        else
                            self.model[key] = parseInt(propValue)
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
                                var itemModel = new Model(self.itemSchemas[key].schema)
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

    appendSchema(newSchema) {
        var self = this;
        var newSchemaKeys = Object.keys(newSchema)
        newSchemaKeys.forEach(function(key, i, arr) {
            self.schema[key] = newSchema[key];
        })
    }

    /** @method readSchema()
     * Returns a human-readable string of the schema
     */
    readSchema() {
        return true
    }

    /** @method flatten() 
     * Flattens the model
    */
    flatten() {
        return true
    }
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

module.exports = Model;