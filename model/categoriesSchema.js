import mongoose from "mongoose";

let categoriesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },

})

let Categories = mongoose.model("Categories", categoriesSchema)
export default Categories