const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const review = require("./models/review.js")


const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log('connected to db');

    }).catch((err) => {
        console.log(err);

    });
async function main() {
    await mongoose.connect(mongo_url)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("hi im root");
});

const validateListing = (req,res,next) => {
       let {error} = listingSchema.validate(req.body);
   if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errmsg);
   } else {
    next();
   }
};

const validateReview = (req,res,next) => {
       let {error} = reviewSchema.validate(req.body);
   if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errmsg);
   } else {
    next();
   }
};

// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings",validateListing ,wrapAsync(async (req, res, next) => {

    if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
        filename: "default",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    };
}
   
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")

})
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id" ,validateListing , wrapAsync(async (req, res) => {
   
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


//reviews
//1. post review route

app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    // res.send("new review saved");

    res.redirect(`/listings/${listing._id}`)
    
}));

//2.Delete route for review

app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res) => {
    let{id,reviewId} = req.params;
await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}});

    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))


app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "smg went wrong!!" } = err;
    //    res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log('server is listening to port 8080');

})