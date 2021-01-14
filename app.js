const express = require("express");


const cors = require("cors");

// initialize app
const app = express();


app.use(cors());
app.use(express.json({ limit: "10mb" }));


const rates = require("./rates_api/rates_api");
app.use("/api", rates);

const PORT = process.env.PORT || 3333;


let server=app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});



