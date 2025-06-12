const mongoose = require("mongoose");

/**
 * Core model creator
 * @param {String} name - model name
 * @param {Object} schemaFields - Mongoose schema definition
 * @param {Object} [options] - Optional mongoose schema settings
 */
function createModel(name, schemaFields, options = {}) {
    const schema = new mongoose.Schema(schemaFields, options);
    return mongoose.model(name, schema);
}

module.exports = createModel;