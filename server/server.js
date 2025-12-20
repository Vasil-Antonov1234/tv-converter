import express from "express";
import routes from "./routes.js";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Working...")
})

app.use(routes);

app.listen(5000, () => console.log("Server is listening on http://localhost:5000..."));
