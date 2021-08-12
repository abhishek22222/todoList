//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-abhishek:Purbey11@cluster0.g3j9c.mongodb.net/todoListDB', { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to todo list"
});
const item2 = new Item({
  name: "This is iteam 2"
});
const item3 = new Item({
  name: "This is iteam 3"
});

const defaultItem = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

  Item.find({}, function (err, itemfound) {
    if (itemfound === 0) {
      Item.insertMany(defaultItem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully added");
        }
        res.redirect("/");

      });
    } else {
      res.render("list", { listTitle: "Today", newListItems: itemfound });
    }



  });



});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.deleteOne({ _id: checkedItemId }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted");
      res.redirect("/");
    }
  });

});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItem
        });
        list.save();
        res.redirect("/"+customListName);

      } else {
        //show an existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });

      }
    }

  });

});





app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port, function () {
  console.log("Server started on port 3000");
});
