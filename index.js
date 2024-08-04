const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.listen(PORT, () => console.log("server is running at port", PORT));

app
  .route("/api/users")
  .get((req, res) => {
    return res.json(users);
  })
  .post((req, res) => {
    const body = req.body;
    users.push({ id: users.length + 1, ...body });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "success", id: users.length });
    });
  });

app
  .route("/api/user/:id")
  .get((req, res) => {
    return res.json(users.find((user) => user.id === Number(req.params.id)));
  })
  .patch((req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...req.body };
      fs.writeFile(
        "./MOCK_DATA.json",
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "error writing file", error: err });
          }

          return res.json({
            status: "user's record updated",
            data: users[userIndex],
          });
        }
      );
    } else {
      return res.status(404).json({ status: "user does not exist" });
    }
  })
  .delete((req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      fs.writeFile(
        "./MOCK_DATA.json",
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ status: "error writing file", error: err });
          }

          return res.json({ status: "user's record deleted", data: users });
        }
      );
    } else {
      return res.status(404).json({ status: "user does not exist" });
    }
  });
