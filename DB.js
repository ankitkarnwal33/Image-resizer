const fs = require("node:fs");

const usersPath = "./data/users";
const sessionsPath = "./data/sessions";
const imagesPath = "./data/images";

class DB {
  constructor() {
    /*
     A sample object in this users array would look like:
     { id: 1, name: "Liam Brown", username: "liam23", password: "string" }
    */
    this.users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    /*
     A sample object in this sessions array would look like:
     { userId: 1, token: 23423423 }
    */
    this.sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf8"));

    this.images = JSON.parse(fs.readFileSync(imagesPath), "utf8");
  }

  update() {
    this.users = JSON.parse(fs.readFileSync(usersPath, "utf8"));
    this.sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf8"));
    this.images = JSON.parse(fs.readFileSync(imagesPath, "utf8"));
  }

  save() {
    fs.writeFileSync(usersPath, JSON.stringify(this.users));
    fs.writeFileSync(sessionsPath, JSON.stringify(this.sessions));
    fs.writeFileSync(imagesPath, JSON.stringify(this.images));
  }
}

const db = new DB();

module.exports = db;
