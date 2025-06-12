const mongoose = require("mongoose");

/**
 * Core model creator
 * @param {String} name - model name
 * @param {Object} schemaFields - Mongoose schema definition
 * @param {Object} [options] - Optional mongoose schema settings
 * @param {Object} [methods] - Optional model methods
 * @param {Object} [preHooks] - Optional schema pre-hooks
 */
function createModel(
    name, 
    schemaFields, 
    options = {},
    methods = {},
    preHooks = {}
) {
    const schema = new mongoose.Schema(schemaFields, options);
    
    for (let hook in preHooks) {
        schema.pre(hook, preHooks[hook]);
    }

    schema.methods = { ...schema.methods, ...methods };
    
    return mongoose.model(name, schema);
}

module.exports = createModel;