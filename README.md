## About The Project

This Coding Challenge is a streamlined tool designed to help users efficiently manage and organize a book collection. It enables users to add new books with relevant details, such as title, author, genre, ISBN and publication date. Users can filter existing books based on various criteria to quickly find specific titles or groups of books. Additionally, the system includes a feature to export book data making it easy to share or archive information.  
The App is built in two parts, Frontend responsible for the user interface and the Backend which is responsible for communicating with the database and handling the book information.

## Built With

- NodeJS
- Express
- PostgreSQL : Database
- Sequelize :The ORM Library for communicating with the database

## Prerequisites

NodeJS: Ensure you have the latest version of NodeJS installed or upgrade your current version to the latest version.  
PostgreSQL: Ensure you have the latest version of PostgreSQL

## Installation

- Clone both repos frontend and the backend
- Install NPM packages npm install
- By default the backend runs on port 3000 however, this can be changed in the index.js file

## Usage

To run the app in dev mode  
npm start  
Once the App is running you should be able to access it on port 3000 if the port was not changed.

## Features

- **GET /api/books** \- Fetches all books
- **POST /api/books** \- Creates a new book.
  - **Request Body:** { "title": "string", "author": "string", "genre": "string", "publicationDate": “string”, "isbn": "string"}
- **GET /api/books/export** \- Export Books
- **GET /api/books/search** \- Searches all books based on the title, author, genre and ISBN criteria

## Improvements

- Database credentials are currently in a config file in the code in an ideal scenario they should be placed in an environment variables because it is sensitive information not to be leaked
- The way the current Schema is designed it does not give room for expanding the uses of the schema. For example if we ever need to add more information about the author like their date of birth it will be impossible to do with this current schema. An improvement on this will be to have an author's table where we can define the different characteristics of the author like their date of birth, gender etc and use a foreign key like the id from the author’s table to the book’s table.
- The above mentioned point also applies to the genre
