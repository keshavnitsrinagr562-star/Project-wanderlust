const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")

const mongo_url= "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log('connected to db');
    
}).catch((err) => {
    console.log(err);
    
});
async function main() {
    await mongoose.connect(mongo_url)
}

app.get("/",(req,res)=>{
    res.send("hi im root");
});

app.get("/testListing", async (req ,res) => {
      let sampleListing = new Listing({
        title : "my new villa",
        description : "beach nearby",
        price : "1200",
        location : "mator",
        country: "India",
      })
      await sampleListing.save();
      console.log('sample was saved');
      res.send("successful testing");
      
});

app.listen(8080,() => {
    console.log('server is listening to port 8080');
    
})