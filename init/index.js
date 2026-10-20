const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await listing.deleteMany({});
   initData.data = initData.data.map((obj)=> ({...obj, owner :"6ace22b1fa024ea375089e8f"}))
  await listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();



// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// require("dotenv").config({ path: "../.env" });

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   try {
//     const updatedData = [];

//     for (const obj of initData.data) {
//       const place = `${obj.location}, ${obj.country}`;

//       const url = new URL(
//         "https://api.mapbox.com/search/geocode/v6/forward"
//       );

//       url.searchParams.set("q", place);
//       url.searchParams.set("limit", "1");
//       url.searchParams.set("access_token", process.env.MAP_TOKEN);

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Mapbox error for ${place}: ${response.status}`);
//       }

//       const result = await response.json();
//       const feature = result.features?.[0];

//       if (!feature) {
//         throw new Error(`Location not found: ${place}`);
//       }

//       updatedData.push({
//         ...obj,
//         owner: "6ace22b1fa024ea375089e8f",
//         geometry: {
//           type: "Point",
//           coordinates: feature.geometry.coordinates,
//         },
//       });

//       console.log(`Coordinates fetched for ${place}`);
//     }

//     await Listing.deleteMany({});
//     await Listing.insertMany(updatedData);

//     console.log("Data was initialized successfully");
//   } catch (err) {
//     console.error("Initialization failed:", err.message);
//   } finally {
//     await mongoose.connection.close();
//   }
// };

// initDB();
