const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees_db",
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update a department",
                "Exit"
            ],
        }).then(function (answer) {
            switch (answer.action) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRole();
                    break;
                case "View all employees":
                    viewEmployee();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update a department":
                    updateDepartment();
                    break;
                case "Exit":
                    connection.end();
                    break;
                default:
                    break;
            }
        })
}

const viewDepartments = () => {

    var query = "SELECT * FROM department":

        connection.query(query, function (err, res) {
            if (err) throw (err);
            console.table(res);
            start();
        });
};

const viewRole = () => {

    var query = "SELECT role.title, role.salary, role.id, department.name FROM role RIGHT JOIN department ON role.department_id = department.id";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};

const viewEmployee = () => {

    var query =
        "SELECT t1.first_name, t1.last_name, CONCAT(t2.first_name,' ',t2.last_name) AS manager FROM employee t1 INNER JOIN employee t2 ON t1.manager_id = t2.id";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([
            {
            name: "firstName",
            type: "input",
            message: "first name?",
            },
            {
            name: "lastName",
            type: "input",
            message: "last name?",
            },
            {
            name: "managerId",
            type: "input",
            message: "first name?",
            },
            {
            name: "addRole",
            type: "list",
            choices: function() {
                return res.map((role) => ({name: role.title, value: role.id}))
            },
            message: "role?",
            },
        ]).then( function (answer) {
            connection.query("INSERT INTO employee SET ?", {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: answer.managerId,
                role_id: answer.addRole,
            }),
            start();
        });
    });
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "employeeId",
                type: "input",
                message: "employee id?"
            },
            {
                name: "updatedRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({name: role.title, value: role.id}));
                },
                message: "role?"
            }
        ]).then(function (answer) {
            console.log(answer.updateRole);
            connection.query(
                "UPDATE employee SET ? WHERE ?", [
                    {role_id: answer.updatedRole}, {id: answer.employeeId}
                ]);
            start();
        });
    });
};

start();