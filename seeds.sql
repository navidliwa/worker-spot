USE employees_db:

INSERT INTO department (name) VALUES
("Sales"),
("Human Resources");

INSERT INTO role (title, salary, department_id) VALUES
("Web Developer", 90000, 1);
("Manager", 100000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("John", "Smith", 1, 2);
("Quincy", "Adams", 2, 3);
("Tracy", "Chapman", 1, 2)