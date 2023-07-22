const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");

app.use(express.json());

app.use(cors());

app.use("/users",userRouter);

app.get("/", (req, res) => {
    res.send("hi");
})

const PORT = process.env.PORT || 5000;
mongoose
    .connect("mongodb+srv://admin:fakeaccount@cluster0.fwz9skd.mongodb.net/login_logout?retryWrites=true&w=majority")
    .then(() => {
        console.log("db connected");
        app.listen(PORT, () => {
            console.log("running...");
        });
    })
    .catch((err) => {
        console.log(err);
    });
