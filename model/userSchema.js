import mongoose from "mongoose"

const usersSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        img: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        }
    }
)


let User = mongoose.model("User", usersSchema)

export default User