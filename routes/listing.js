const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")

const validateListing = (req,res,next) => {
       let {error} = listingSchema.validate(req.body);
   if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errmsg);
   } else {
    next();
   }
};

// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

// new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","listing you requested doesn't exists!");
        res.redirect("/listings");
    }else{

        res.render("listings/show.ejs", { listing });
    }
}));

//create route
router.post("/",validateListing ,wrapAsync(async (req, res, next) => {

    if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
        filename: "default",
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
    };
}
   
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    req.flash("success","new listing created successfully!!");
    res.redirect("/listings")

})
);

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested doesn't exists!");
        res.redirect("/listings");
    }else{

        res.render("listings/edit.ejs", { listing });
    }
}));

//Update Route
router.put("/:id" ,validateListing , wrapAsync(async (req, res) => {
   
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","update successfully!!");
    res.redirect(`/listings/${id}`);
}));


//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
     req.flash("success","listing deleted successfully!!");
    res.redirect("/listings");
}));

module.exports= router;