/* Importing Modules */

const express = require("express");
const mongoose = require("mongoose");

/* Creating Express.js App */
const app = express();

/* Connection to DB from Node.JS App */
mongoose
  .connect(
    "add_your_mongoDB_connection_string_here",
  )
  .then(() => console.log("Connection Established !"))
  .catch((err) => console.log("Please Check Error", err));

/* Middlewire */
app.use(express.urlencoded({ extended: false }));
// app.use(express.json({ extended: false }));

/* creating schema */
const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  techStack: [String],
  role: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("employeeData", employeeSchema);

/* specifying which method to work on and on which end point */

app.post("/api/employee", async (req, res) => {
  try {
    const emprole = req.body.role;
    const empDataCount = await Employee.find();
    let generatedEmpId = null;
    if (empDataCount.length < 1) {
      generatedEmpId = "61000" + req.body.name.slice(0, 3).toUpperCase();
    } else {
      generatedEmpId =
        String(
          Number(empDataCount[empDataCount.length - 1].empId.slice(0, 5)) + 1
        ) + req.body.name.slice(0, 3).toUpperCase();
    }

    const techStackCollection = (req.body.TechStack || "").split(",");
    // .map(item => item.trim());

    console.log("Processed TechStack:", techStackCollection);

    const reqBody = {
      empId: generatedEmpId,
      name: req.body.name,
      designation: req.body.designation,
      salary: req.body.salary,
      techStack: techStackCollection,
      role: req.body.role,
    };
    if (emprole == "Admin") {
      await Employee.create(reqBody);
      return res.status(201).send("Employee Added in DB");
    } else {
      console.log("You are not authorized to add employee");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/api/employee", async (req, res) => {
  try {
    const allEmpData = await Employee.find();
    return res.status(200).send(allEmpData);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/employee/:empID", async (req, res) => {
  try {
    const empData = await Employee.findOne({ empId: req.params.empID });
    return res.status(200).send(empData);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(8000, () => console.log("listening at port 8000..."));
