const express = require('express');
const bodyParser = require('body-parser');
require('./db')(); 
const Employee = require('./models/employee'); 

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add a new employee
app.post('/employees', async (req, res) => {
  try {
    const { name, joiningDate, position, department } = req.body;
    console.log({ name, joiningDate, position, department });
    const employee = new Employee({ name, joiningDate, position, department });
    let data = await employee.save();
    console.log("data", data);
    res.status(201).send({ message: 'Employee added successfully', employee });
  } catch (error) {
    res.status(500).send({ message: 'Error adding employee', error });
  }
});

// Get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching employees', error });
  }
});

// Get employees by joining month with aggregation
app.get('/employees/month/:month', async (req, res) => {
  try {
    const month = Number(req.params.month);

    let employees = await Employee.aggregate([
      // Match employees whose joining date matches the specified month
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$joiningDate" }, month],
          },
        },
      },
      // Group employees by the month they joined
      {
        $group: {
          _id: { $month: "$joiningDate" },
          totalData: { $sum: 1 },
          data: { $push: "$$ROOT" },
        },
      },
      // Project a structured response
      {
        $project: {
          month: "$_id",
          _id: 0,
          totalData: 1,
          employees: {
            $map: {
              input: "$data",
              as: "employee",
              in: {
                name: "$$employee.name",
                department: "$$employee.department",
                joiningDate: "$$employee.joiningDate",
              },
            },
          },
        },
      },
      // Sort by joiningDate in ascending order
      {
        $sort: {
          "employees.joiningDate": 1,
        },
      },
    ]);

    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: 'Error Fetching Data', error });
  }
});

// Define the server port and start the application
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
