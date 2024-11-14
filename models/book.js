import { DataTypes } from "sequelize";

const BooksModel = (sequelize) => {
  const books = sequelize.define("books", {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "title",
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "author",
    },
    genre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "genre",
    },
    publicationDate: {
      type: DataTypes.DATE(),
      allowNull: false,
      field: "publicationDate",
    },
    isbn: {
      type: DataTypes.STRING(13),
      allowNull: false,
      field: "isbn",
      unique: true,
    },
  });

  books.schema("public");

  return books;
};

export default BooksModel;
