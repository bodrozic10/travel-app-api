import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.listen(process.env.port || 3000, () => {
  console.log("Server is running on port 3000");
});
