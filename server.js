const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3001,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employee_db'
});

// inquirer prompt for first action
const promptUser = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: ['View all employees',
        'Add an employee',
        'Delete an employee',
        'View all roles',
        'Add a role',
        'Delete a role',
        'View all departments',
        'Add a department',
        'Delete a department',
        'View employees by department',
        'No Action']
    }
  ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View all employees") {
        showEmployees();
      }

      if (choices === "Add an employee") {
        addEmployee();
      }

      if (choices === "Delete an employee") {
        deleteEmployee();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "Add a role") {
        addRole();
      }

      if (choices === "Delete a role") {
        deleteRole();
      }

      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "Add a department") {
        addDepartment();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "View employees by department") {
        employeeDepartment();
      }

      if (choices === "No Action") {
        connection.end()
      };
    });
};

// function to show all employees 
showEmployee = () => {
  console.log('Showing all employees...\n'); 
  const sql = `SELECT employee.id,employee.first_name,employee.last_name,title,name AS department,salary,
    CONCAT(e.first_name," ",e.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee e
    ON employee.manager_id = e.id
    ORDER BY employee.id;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}
// function to add an employee 
function addRole() {
  db.query(
    `SELECT DISTINCT * FROM department`, (err, result) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: "role",
          type: "input",
          message: "What is the title of the role you like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role? (must be a number and without separating with commas)",
          validate: input => {
            if (isNaN(input)) {
              console.log("Please enter a number!")
              return false;
            } else {
              return true;
            }
          }
        },
        {
          name: 'department',
          type: 'list',
          message: "What department does the role belong to?",
          choices: () =>
            result.map((result) => result.name),
        }])
        .then(function (answers) {
          const departmentID = result.filter((result) => result.name === answers.department)[0].id;
          db.query(
            "ALTER TABLE role AUTO_INCREMENT = 1; INSERT INTO role SET ?",
            {
              title: answers.role,
              salary: answers.salary,
              department_id: departmentID
            },
            function (err) {
              if (err) throw err;
              console.log(answers.role + " successfully add to roles under " + answers.department);
              initPrompt();
            }
          );
        });
    })
};
// function to show all roles 
showRole = () => {
  const sql = `SELECT role.id,title, department.name AS department,salary
      FROM role 
      LEFT JOIN department 
      ON role.department_id = department.id
      ORDER BY role.id;`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}

// function to add a role 
function addRole() {
  db.query(
    `SELECT DISTINCT * FROM department`, (err, result) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: "role",
          type: "input",
          message: "What is the title of the role you like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role? (must be a number and without separating with commas)",
          validate: input => {
            if (isNaN(input)) {
              console.log("Please enter a number!")
              return false;
            } else {
              return true;
            }
          }
        },
        {
          name: 'department',
          type: 'list',
          message: "What department does the role belong to?",
          choices: () =>
            result.map((result) => result.name),
        }])
        .then(function (answers) {
          const departmentID = result.filter((result) => result.name === answers.department)[0].id;
          db.query(
            "ALTER TABLE role AUTO_INCREMENT = 1; INSERT INTO role SET ?",
            {
              title: answers.role,
              salary: answers.salary,
              department_id: departmentID
            },
            function (err) {
              if (err) throw err;
              console.log(answers.role + " successfully add to roles under " + answers.department);
              initPrompt();
            }
          );
        });
    })
};

// function to show all departments 
showDepartment = () => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.table(result);
    initPrompt();
  });
}

// function to add a department 
function addDepartment() {
  inquirer.prompt({
    name: 'newDepartment',
    type: 'input',
    message: 'Which department would you like to add?'
  }).then(function (answer) {
    db.query(
      `ALTER TABLE department AUTO_INCREMENT = 1; INSERT INTO department SET ?`,
      {
        name: answer.newDepartment
      });
    const sql = 'SELECT * FROM department';
    db.query(sql, function (err, res) {
      if (err) throw err;
      console.log(answer.newDepartment + ' has been added!');
      console.table('All Departments:', res);
      initPrompt();
    })
  })
};
// function to view employee by department
employeeDepartment = () => {
  console.log('Showing employee by departments...\n');
  const sql = `SELECT employee.first_name, 
                        employee.last_name, 
                        department.name AS department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id 
                 LEFT JOIN department ON role.department_id = department.id`;

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

// function to delete employees
function deleteEmployee() {
  db.query("SELECT DISTINCT CONCAT(first_name,' ',last_name) AS full_name FROM employee", (err, result) => {
    if (err) throw err;
    inquirer.prompt({
      name: "full_name",
      type: "list",
      message: "Which employee would you like to delete?",
      choices: () =>
        result.map((result) => result.full_name)
    })
      .then((answer) => {
        console.log(answer.full_name)
        db.query(`SET FOREIGN_KEY_CHECKS=0;
        DELETE FROM employee WHERE CONCAT(first_name,' ',last_name) = "${answer.full_name}"`,

          (err, result) => {
            if (err) throw err;
            console.log(
              "Successfully deleted the employee named " + answer.full_name + "."
            );
            initPrompt();
          });
      })
  })
}

// function to delete role
function deleteRole() {
  db.query("SELECT DISTINCT title FROM role", (err, result) => {
    if (err) throw err;
    inquirer.prompt({
      name: "title",
      type: "list",
      message: "Which role would you like to delete?",
      choices: () =>
        result.map((result) => result.title)
    })
      .then((answer) => {
        db.query(`SET FOREIGN_KEY_CHECKS=0;
        DELETE FROM role WHERE ?`, { title: answer.title },
          (err, result) => {
            if (err) throw err;
            console.log(
              "Successfully deleted the " + answer.title + " role."
            );
            initPrompt();
          });
      })
  })
}

// function to delete department
function deleteDepartment() {
  db.query("SELECT DISTINCT name FROM department", (err, result) => {
    if (err) throw err;
    inquirer.prompt({
      name: "department",
      type: "list",
      message: "Which department would you like to delete?",
      choices: () =>
        result.map((result) => result.name)
    })
      .then((answer) => {
        db.query(`SET FOREIGN_KEY_CHECKS=0;
      DELETE FROM department WHERE ?`, { name: answer.department },
          (err, result) => {
            if (err) throw err;
            console.log(
              "Successfully deleted the " + answer.department + " department."
            );
            initPrompt();
          });
      })
  })
}