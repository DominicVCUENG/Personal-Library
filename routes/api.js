/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { v4: uuidv4 } = require('uuid');

// In-memory storage for books
let books = {};

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      // Retrieve all books
      const bookArray = Object.values(books).map(book => ({
        _id: book._id,
        title: book.title,
        commentcount: book.comments.length
      }));
      res.json(bookArray);
    })
    
    .post(function (req, res){
      let title = req.body.title;

      // Check if title is provided
      if (!title) {
        res.send('missing required field title');
        return;
      }

      // Create a new book
      const newBook = {
        _id: uuidv4(),
        title: title,
        comments: []
      };

      // Store the book in memory
      books[newBook._id] = newBook;

      // Respond with the new book object
      res.json({ _id: newBook._id, title: newBook.title });
    })
    
    .delete(function(req, res){
      // Clear all books from memory
      books = {};
      res.send('complete delete successful');
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      // Find the book by ID
      const book = books[bookid];

      // If book not found, respond with appropriate message
      if (!book) {
        res.send('no book exists');
        return;
      }

      // Respond with the book object including comments
      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      // Check if comment is provided
      if (!comment) {
        res.send('missing required field comment');
        return;
      }

      // Find the book by ID
      const book = books[bookid];

      // If book not found, respond with appropriate message
      if (!book) {
        res.send('no book exists');
        return;
      }

      // Add the comment to the book
      book.comments.push(comment);

      // Respond with the updated book object
      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments
      });
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      // Check if book exists
      if (!books[bookid]) {
        res.send('no book exists');
        return;
      }

      // Delete the book
      delete books[bookid];

      // Respond with success message
      res.send('delete successful');
    });
  
};
