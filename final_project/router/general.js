const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }

    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 2)); // Pretty-print JSON
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    try {
        if (books[isbn]) {
            return res.status(200).send(JSON.stringify(books[isbn], null, 2)); // Pretty-print book details
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    try {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

        if (filteredBooks.length > 0) {
            return res.status(200).send(JSON.stringify(filteredBooks, null, 2)); // Pretty-print filtered books
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    try {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

        if (filteredBooks.length > 0) {
            return res.status(200).send(JSON.stringify(filteredBooks, null, 2)); // Pretty-print filtered books
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    try {
        if (books[isbn] && books[isbn].reviews) {
            return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2)); // Pretty-print reviews
        } else {
            return res.status(404).json({ message: "No reviews found for this book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching reviews" });
    }
});

module.exports.general = public_users;
