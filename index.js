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
                "Update an employee role",
                "Exit",
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
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
                default:
                    connection.end();
                    break;
            }
        })
};

const viewDepartments = () => {

    var query = "SELECT * FROM department";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};

const viewRole = () => {

    var query =
        "SELECT role.title, role.salary, role.id, department.name AS department FROM role RIGHT JOIN department ON role.department_id = department.id";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};

const viewEmployee = () => {

    var query =
        "SELECT t1.id, t1.first_name, t1.last_name, role.title AS role, role.salary AS salary, department.name AS department, CONCAT(t2.first_name,' ',t2.last_name) AS manager FROM employee t1 INNER JOIN role ON t1.role_id = role.id LEFT JOIN department ON role.department_id = department.id INNER JOIN employee t2 ON t1.manager_id = t2.id";
        // "SELECT id, first_name, last_name FROM employee";

    connection.query(query, function (err, res) {
        if (err) throw (err);
        console.table(res);
        start();
    });
};

const addRole = () => {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([
            {
                name: "roleName",
                type: "input",
                message: "What will the new role be?"
            },
            {
                name: "salary",
                type: "input",
                message: "What will the salary be for this position?"
            },
            {
                name: "deparmentId",
                type: "list",
                choices: function () {
                    return res.map((department) => ({ name: department.name, value: department.id }))
                },
                message: "What is the deparment id for this role?",
            },
        ]).then(function (answer) {
            connection.query("INSERT INTO role SET ?", {
                title: answer.roleName,
                salary: answer.salary,
                department_id: answer.deparmentId
            }),
                start();
        });
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
                type: "list",
                choices: function () {
                    return new Promise(function (resolve, reject) {
                        connection.query("SELECT * FROM employee", function (err, res) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(res.map((employee) => ({ name: employee.first_name, value: employee.id })))
                            }
                        });
                    });
                },
                message: "Who will be this employee's manager?",
            },
            {
                name: "addRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }))
                },
                message: "role?",
            },
        ]).then(function (answer) {
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
        if (err) throw err;
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                choices: function () {
                    return new Promise(function (resolve, reject) {
                        connection.query("SELECT * FROM employee", function (err, res) {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(res.map((employee) => ({ name: employee.first_name, value: employee.id })))
                            }
                        });
                    });
                },
                message: "Wich employee will you be updating??"
            },
            {
                name: "updatedRole",
                type: "list",
                choices: function () {
                    return res.map((role) => ({ name: role.title, value: role.id }));
                },
                message: "What will be the updated role for the employee?"
            }
        ]).then(function (answer) {
            console.log(answer.updatedRole);
            connection.query(
                "UPDATE employee SET ? WHERE ?", [
                { role_id: answer.updatedRole }, { id: answer.employee }
            ]);
            start();
        });
    });
};

start();