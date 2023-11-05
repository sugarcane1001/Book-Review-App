const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        req.session.username = username;
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

//adding book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assuming the username is stored in the session
    const review = req.query.review;

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to post a review." });
    }

    if (books[isbn]) {
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Check if the user has already posted a review for this ISBN
        if (books[isbn].reviews[username]) {
            // Modify the existing review
            books[isbn].reviews[username] = review;
        } else {
            // Add a new review
            books[isbn].reviews[username] = review;
        }

        res.send(`Review for ISBN ${isbn} updated/added.`);
    } else {
        res.status(404).json({ message: "Book with the specified ISBN not found." });
    }

});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (isbn) {
        delete books[isbn].reviews;
    }
    res.send(`Book review with ISBN  ${isbn} deleted.`);
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

