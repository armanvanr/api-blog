const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb+srv://armanvenska:ezpeasy@cluster0.fiyusps.mongodb.net/?retryWrites=true&w=majority")
    .catch(err => console.log(err));
};

mongoose.connection.on("error", err => {
  console.error("MongoDB connection error", err);
});

module.exports = connect;

