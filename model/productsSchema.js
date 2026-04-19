import mongoose from "mongoose";

let ProductsSchema = mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    desc: String,

    comments: [
        {
            user: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },

})

let Product = mongoose.model("Products", ProductsSchema)
export default Product        