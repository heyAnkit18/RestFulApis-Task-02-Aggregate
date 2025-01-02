const express = require('express');
const bodyParser = require('body-parser');
require('./db')();
const Employee = require('./models/employee');


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}))




app.post('/employees', async (req, res) => {
  try {
    const { name, joiningDate, position, department } = req.body;
    console.log({ name, joiningDate, position, department })
    const employee = new Employee({ name, joiningDate, position, department });
    let data=await employee.save();
    console.log("data",data)
    res.status(201).send({ message: 'Employee added successfully', employee });
  } catch (error) {
    res.status(500).send({ message: 'Error adding employee', error });
  }
});


app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching employees', error });
  }
});

//to find employees with months with aggregate Function
app.get('/employees/month/:month', async (req, res) => {
    
  try {
    const month = Number(req.params.month); 
    // const employees = await Employee.find({
    //   joiningDate: {
    //     $gte: new Date(new Date().getFullYear(), month - 1, 1),
    //     $lt: new Date(new Date().getFullYear(), month, 1),

    //   },
    // })
    let employees=await Employee.aggregate([
        {
            $group:{
                _id:{
                    $month:"$createdAt",
                },
                totalData:{$sum:1},
                data:{
                    $push:"$$ROOT"
                }
            }
        },
        {
            $project:{
                month:"$_id",
                _id:0,
                totalData:1,
                customizeData:{
                    "name":"$data.name"
                }
            }
        }
    ])
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send({ message: 'Error Fetching Data', error });
  }
});

app.get('.')


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
