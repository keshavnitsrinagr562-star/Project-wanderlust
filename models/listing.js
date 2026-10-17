
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")

const listingSchema = new Schema ({
    title : {
        type :String,
        required : true ,
    },
    description: String,
    image : {
        filename : String,
        url : {
         type: String,
         default: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        }
    },
    price : Number,
    location : String,
    country : String,
    reviews : [

        {
            type : Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }

});

listingSchema.post("findOneAndDelete",async(listing) => {
    if(listing){

        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const listing = mongoose.model("listing",listingSchema);
module.exports = listing ;