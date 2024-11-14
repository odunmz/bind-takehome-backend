// const express = require("express");
// const { Sequelize } = require("sequelize");
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const port = 3000;
import BooksModel from "./models/book.js";

import { Sequelize, where, Op } from "sequelize";
import { Where } from "sequelize/lib/utils";
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize("sampledb", "", "", {
  host: "localhost",
  dialect: "postgres",
});

const booksModel = BooksModel(sequelize);

async function initDbConnection() {
  try {
    await sequelize.authenticate();
    sequelize.sync();

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

initDbConnection();

app.get("/books", async function (req, res, next) {
  try {
    const books = await booksModel.findAll();
    res.send(books);
    console.log(books);
  } catch (err) {
    console.log(err);
  }
});

app.post("/addBook", async (req, res) => {
  const { title, author, genre, publicationDate, isbn } = req.body;
  if (!title || !author || !genre || !publicationDate || !isbn) {
    res.status(400).json({ errorMsg: "Please Enter all Fields" });
    return;
  }

  const bookExist = await booksModel.findOne({ where: { isbn: isbn } });
  if (bookExist) {
    res.status(400).json({ errorMsg: "Book already added, add another book" });
    return;
  }
  try {
    const book = await booksModel.create({
      title,
      author,
      genre,
      publicationDate,
      isbn,
    });

    return res.status(201).json(book);
  } catch (e) {
    console.log(e);
    res.status(500).json({ errorMsg: "Could not add book" });
  }
});

app.get("/books/export", async (req, res) => {
  try {
    const books = await booksModel.findAll({ raw: true });
    const bookKeys = Object.keys(books[0]);

    const refinedData = [];
    refinedData.push(bookKeys);

    books.forEach((item) => {
      refinedData.push(Object.values(item));
    });

    let csvContent = "";

    refinedData.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
    console.log(refinedData, csvContent);

    res.writeHead(200, {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=books_list.csv",
    });
    res.end(csvContent);
  } catch (err) {
    console.log(err);
  }
});

app.get("/books/search", async (req, res) => {
  try {
    console.log({ searchQuery: req.query });
    const { publicationDateStart, publicationDateEnd, searchQuery } = req.query;

    const searchFieldQuery = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: "%" + searchQuery + "%",
          },
        },
        {
          author: {
            [Op.iLike]: "%" + searchQuery + "%",
          },
        },
        {
          genre: {
            [Op.iLike]: "%" + searchQuery + "%",
          },
        },

        {
          isbn: {
            [Op.iLike]: "%" + searchQuery + "%",
          },
        },
      ],
    };

    let where = {};
    if (searchQuery) {
      where = searchFieldQuery;
    }

    if (publicationDateEnd && publicationDateStart) {
      where = {
        [Op.and]: {
          publicationDate: {
            [Op.between]: [publicationDateStart, publicationDateEnd],
          },
          ...where,
        },
      };
    }
    console.log({ where }, "e-------");
    const searchBooks = await booksModel.findAll({
      where,
    });
    console.log(searchBooks);

    return res.json(searchBooks);
  } catch (err) {
    console.log(err);
  }
});

app.get("/books/filter", async (req, res) => {
  try {
    console.log({ searchQuery: req.query });

    const filterBooks = await booksModel.findAll({
      where: {
        [Op.and]: [
          {
            publicationDate: {
              [Op.between]: ["1960/01/01", "2021/12/31"],
            },
          },
          Sequelize.where(
            Sequelize.cast(Sequelize.col("time_scheduled"), "time"),
            ">=",
            "12:00"
          ),
          Sequelize.where(
            Sequelize.cast(Sequelize.col("time_scheduled"), "time"),
            "<=",
            "15:00"
          ),
        ],
      },
    });
    return res.json(filterBooks);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}!`);
});
