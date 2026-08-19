require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function test() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected!");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();
