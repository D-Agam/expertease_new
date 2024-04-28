const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser");
const e = require("express");
const { INSERT } = require("sequelize/lib/query-types");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const connection = mysql.createConnection({
  host: "localhost",
  database: "project",
  user: "Agam7",
  password: "AgamD",
});
let user_name = "";
let user_contact = "";
let location = "";
let services1="";
let payment=0;
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  let city = req.body.location;

  connection.query(
    "SELECT * FROM users WHERE name = ? AND password = ?",
    [name, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      if (results.length === 0) {
        return res.redirect("/login");
      }

      // Retrieve user contact information
      const userContactQuery =
        "SELECT phonenumber FROM users WHERE name = ? AND password = ?";
      connection.query(
        userContactQuery,
        [name, password],
        (err, userResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Internal server error");
          }
          user_contact = userResult[0].phonenumber;
          user_name = name;
          location = city;
          // Render template based on city
          switch (city) {
            case "chandigarh":
              return res.render("chand.ejs", { name, city, user_contact });
            case "delhi/ncr":
              return res.render("delhi.ejs", { name, city, user_contact });
            case "mumbai":
              return res.render("mumbai.ejs", { name, city, user_contact });
            case "ahmedabad":
              return res.render("ahmedabad.ejs", { name, city, user_contact });
            case "kolkata":
              return res.render("kolkata.ejs", { name, city, user_contact });
            default:
              return res.status(400).send("Invalid city");
          }
        }
      );
    }
  );
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.post("/signup", (req, res) => {
  let name = req.body.name;
  let password = req.body.password;
  let isValid = true;
  let contact = req.body.contact;
  let city = "chandigarh";
  if (contact.length !== 10) {
    return res.redirect("/signup");
  }

  connection.query(
    "SELECT phonenumber FROM users WHERE phonenumber=?",
    [contact],
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        if (results.length !== 0) {
          res.render("login.ejs");
        } else {
          connection.query(
            "INSERT INTO users(name, password, phonenumber) VALUES (?, ?, ?)",
            [name, password, contact],
            function (err, results) {
              if (err) {
                console.error(err);
                isValid = false;
              } else {
                console.log("User Entered");
              }

              if (isValid) {
                user_name = name;
                user_contact = contact;
                location = city;
                console.log("Success");
                console.log(city);
                if (city === "chandigarh") {
                  res.render("chand.ejs", { name: name, city: city });
                } else if (city === "delhi/ncr") {
                  res.render("delhi.ejs", { name: name, city: city });
                } else if (city === "mumbai") {
                  res.render("mumbai.ejs", { name: name, city: city });
                } else if (city === "ahmedabad") {
                  res.render("ahmedabad.ejs", { name: name, city: city });
                } else if (city === "kolkata") {
                  res.render("kolkata.ejs", { name: name, city: city });
                }
              } else {
                res.redirect("/signup");
              }
            }
          );
        }
      }
    }
  );
});

app.post("/repair", (req, res) => {
  res.render("repair.ejs");
});

app.post("/clean", (req, res) => {
  res.render("clean.ejs");
});

app.post("/paint", (req, res) => {
  res.render("paint.ejs");
});

app.post("/furniture", (req, res) => {
  res.render("furniture.ejs");
});

app.post("/saloon", (req, res) => {
  res.render("salonhome.ejs");
});

app.post("/genie", (req, res) => {
  res.render("genie.ejs");
});
app.post("/salonm", (req, res) => {
  res.render("salonm.ejs");
});
app.post("/salonw", (req, res) => {
  res.render("salonw.ejs");
});
app.post("/salonw1", (req, res) => {
  res.render("salonw1.ejs");
});
app.post("/hairw1", (req, res) => {
  res.render("hairw1.ejs");
});
app.post("/nailw1", (req, res) => {
  res.render("nailw1.ejs");
});
app.post("/spaw1", (req, res) => {
  res.render("spaw1.ejs");
});
app.post("/spam1", (req, res) => {
  res.render("spam1.ejs");
});
app.post("/salonm1", (req, res) => {
  res.render("salonm1.ejs");
});
app.post("/confirmation", (req, res) => {
  res.render("confirmation.ejs");
});
app.post("/salonm", (req, res) => {
  res.render("salonm.ejs");
});
app.get("/history", (req, res) => {
  const query = `SELECT * FROM users_hist WHERE name = ? AND phonenumber = ?`;
  connection.query(query, [user_name, user_contact], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data from database");
      return;
    }    
    console.log(results);
    res.render('history.ejs', { data: results });
  });
});
app.get("/faqs",(req,res)=>{
  const query = `SELECT * FROM faqs`;
  connection.query(query,(err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error fetching data from database");
      return;
    }    
    console.log(results);
    res.render('faq.ejs', { data: results });
  });
})
app.post("/faqs", (req, res) => {
  let question = req.body.question_input;
  console.log(question);
      let insertQuery = `INSERT INTO faqs (question) VALUES (?)`;
      connection.query(insertQuery, [question], (err, results) => {
          if (err) {
              console.error("Error inserting data:", err);
              res.status(500).send("Error inserting data into the database");
          } else {
              console.log("Question inserted successfully");
              res.render("faq.ejs");
          }
      });
  }
);

app.get("/checkout", (req, res) => {
  let amount = req.query.total;
  let services = [];
  let index = 1;
  // Loop through the submitted cart items
  while (req.query[`service${index}`] !== undefined && req.query[`price${index}`] !== undefined) {
      let service = req.query[`service${index}`];
      services.push(service);
      index++;
  }
  console.log(amount);
  console.log(services);
  payment=amount;
  services1=services;
  res.render("checkout.ejs", {
      name: user_name,
      contact: user_contact,
      location: location,
      amount: amount,
      services: services,
  });
});

app.post("/checkout", (req, res) => {
  let services = JSON.stringify(services1); // Convert array to string
  let date = req.body.deliveryDate;
  console.log(payment);
  connection.query(
    "INSERT INTO users_hist(name, phonenumber, amount, location, date, services) VALUES (?, ?, ?, ?, ?, ?)",
    [user_name, user_contact, payment, location, date, services],
    function (err, results) {
      if (err) {
        console.error(err);
        res.redirect("/checkout");
      } else {
         res.send("Order confirmed");
      }
    }
  );
});


app.listen(3000, () => {
  console.log("Server started");
});
