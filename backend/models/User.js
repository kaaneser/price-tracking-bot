const createModel = require("../core/model");
const bcrypt = require("bcryptjs");

const UserSchema = {
    email: { type: String, required: true, unique: true },
    phone_number: String,
    telegram_id: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    created_at: { type: Date, default: Date.now },
};

const preHooks = {
    save: async function (next) {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }

        next();
    }
};

const methods = {
    isPasswordValid: async function (password) {
        return bcrypt.compare(password, this.password);
    }
};

module.exports = createModel("User", UserSchema, {}, methods, preHooks);