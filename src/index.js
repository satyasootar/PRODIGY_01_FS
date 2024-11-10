const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');

const app = express();
// Convert data into JSON format
app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Route to render login page
app.get("/", (req, res) => {
    res.render("login");
});

// Route to render signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        // Check if the username already exists
        const existingUser = await collection.findOne({ name: data.name });

        if (existingUser) {
            return res.send('User already exists. Please choose a different username.');
        } else {
            // Hash the password
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);

            // Insert user data into the database
            await collection.insertMany(data);
            console.log("User registered successfully.");
            return res.redirect("/");  // Redirect to login page after successful signup
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during registration.");
    }
});

// Login User
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("User name not found");
        }

        // Compare the hashed password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Incorrect Password");
        } else {
            res.render("home");  // Render home page upon successful login
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});

// Define port for application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
