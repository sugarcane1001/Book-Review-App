const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });


});


// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});*/

public_users.get('/', async (req, res) => {
    try {
        res.send(JSON.stringify(books, null, 4));
    }
    catch (error) {
        res.status(500).send('Error fetching books');
    }
});


// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });*/

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        res.send(books[isbn])
    }
    catch (error) {
        res.status(500).send('Error fetching books by ISBN');
    }
});


// Get book details based on author
/*public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = {};

    for (const key in books) {
        if (books.hasOwnProperty(key) && books[key].author === author) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: `No books found for author ${author}` });
    }
});*/

public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const matchingBooks = {};

        for (const key in books) {
            if (books.hasOwnProperty(key) && books[key].author === author) {
                matchingBooks[key] = books[key];
            }
        }

        if (Object.keys(matchingBooks).length > 0) {
            res.json(matchingBooks);
        } else {
            res.status(404).json({ message: `No books found for author ${author}` });
        }
    }
    catch (error) {
        res.status(500).send('Error fetching books by author');
    }
});


// Get all books based on title
/*public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = {};

    for (const key in books) {
        if (books.hasOwnProperty(key) && books[key].title === title) {
            matchingBooks[key] = books[key];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: `No books found for title ${title}` });
    }
});*/

public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const matchingBooks = {};

        for (const key in books) {
            if (books.hasOwnProperty(key) && books[key].title === title) {
                matchingBooks[key] = books[key];
            }
        }

        if (Object.keys(matchingBooks).length > 0) {
            res.json(matchingBooks);
        } else {
            res.status(404).json({ message: `No books found for title ${title}` });
        }
    } catch (error) {
        res.status(500).send('Error fetching books by title');
    }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        const reviews = books[isbn].reviews;
        res.json(reviews);
    } else {
        res.status(404).json({ message: `No reviews found for ISBN ${isbn}` });
    }
});

module.exports.general = public_users;

