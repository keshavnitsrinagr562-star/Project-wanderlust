const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title : {
        type :String,
        required : true ,
    },
    description: String,
    image : {
        type : String,
        default : "https://www.google.com/search?q=images&ie=UTF-8#sv=CAMSZxowKg5Zb2xVX0diZzZCMjVpTTIOWW9sVV9HYmc2QjI1aU06Dk9YS0xlNGlCUVpGNkdNIAQqLwobX3hMeTdhcHlvR2VlZHNlTVA0dUNvMEEwXzcyEg5Zb2xVX0diZzZCMjVpTRgAMAEYByDMk9mlBUoIEAIYASACKAE" ,
        Set : (v) => v ==="" ? "https://www.google.com/search?q=images&ie=UTF-8#sv=CAMSZxowKg5Zb2xVX0diZzZCMjVpTTIOWW9sVV9HYmc2QjI1aU06Dk9YS0xlNGlCUVpGNkdNIAQqLwobX3hMeTdhcHlvR2VlZHNlTVA0dUNvMEEwXzcyEg5Zb2xVX0diZzZCMjVpTRgAMAEYByDMk9mlBUoIEAIYASACKAE" : v ,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing ;