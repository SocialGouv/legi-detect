const express = require("express");
const cors = require("cors");

const { replace } = require("@socialgouv/legi-detect");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const text = req.body.text;
  if (text) {
    return res.json({
      html: replace(text)
    });
  }
  return res.status(500).json({ error: "empty text" });
});

const port = process.env.PORT || 3010;

app.listen(`${port}`, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
