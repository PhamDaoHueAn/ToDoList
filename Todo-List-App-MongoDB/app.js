const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Thêm tên database vào connection string
const MONGODB_URI = process.env.MONGODB_URI.replace('/?', '/todolistDB?');

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Kết nối MongoDB thành công");
        // Tạo dữ liệu mẫu
        createInitialItems();
    })
    .catch(err => console.log("Lỗi kết nối MongoDB:", err));

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

// Hàm tạo dữ liệu mẫu
async function createInitialItems() {
    try {
        const count = await Item.countDocuments();
        if (count === 0) {
            const defaultItems = [
                { name: "Chào mừng đến với Todo List 👋" },
                { name: "Nhấn + để thêm việc mới" },
                { name: "⬅️ Tick vào ô để xóa việc" }
            ];
            await Item.insertMany(defaultItems);
            console.log("Đã tạo dữ liệu mẫu");
        }
    } catch (err) {
        console.log("Lỗi tạo dữ liệu mẫu:", err);
    }
}

const formatedDate = date.getDate();

app.get("/", async (req, res) => {
    try {
        const items = await Item.find({}).sort({ _id: -1 });
        res.render("list", { 
            listTitle: formatedDate, 
            listArray: items 
        });
    } catch (err) {
        console.log("Error:", err);
        res.redirect("/");
    }
});

app.post("/", async (req, res) => {
    const newItem = req.body.newItem;
    if (!newItem || newItem.trim() === "") return res.redirect("/");

    try {
        await Item.create({ name: newItem });
        res.redirect('/');
    } catch (err) {
        console.log("Error:", err);
        res.redirect('/');
    }
});

app.post('/edit', async (req, res) => {
    const { itemId, newName } = req.body;
    
    if (!newName || newName.trim() === "") {
        return res.redirect("/");
    }

    try {
        await Item.findByIdAndUpdate(itemId, { name: newName });
        res.redirect('/');
    } catch (err) {
        console.log("Error:", err);
        res.redirect('/');
    }
});

// Cập nhật route xóa để nhận JSON
app.post('/delete', express.json(), async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.body.itemId);
        res.json({ success: true });
    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ success: false });
    }
});

module.exports = app;