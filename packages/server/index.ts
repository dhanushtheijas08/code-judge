import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello");
});

app.listen(8080, () => console.log(`Running in port 8080`));
