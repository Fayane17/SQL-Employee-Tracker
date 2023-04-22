INSERT INTO department (name)
VALUES ("Sales"),
       ("Finance"),
       ("Marketing"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 80000, 1),
       ("Sales assocate", 30000, 1),
       ("Account Manager", 180000, 2),
       ("Accountant", 15000, 2),
       ("Marketing Manager", 120000, 3),
       ("Marketing Analyst", 80000, 3),
       ("HR Coordinator", 100000, 4),
       ("HR Manager", 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Peter", "Parker", 1, 2),
       ("Wanda", "Maximoff", 2, NULL),
       ("Bucky", "Barnes", 3, 13),
       ("Clark", "Kent", 4, NULL),
       ("Sam", "Wilson", 5, 13),
       ("Bruce", "Wayne", 6, NULL),
       ("Bruce", "Banner", 7, 4),  
       ("Wade", "Wilson", 9, ),
       ("Barry", "Allen", 10, 4),
       ("Dick", "Grayson", 11, 6),
       ("Riri", "Williams", 12, 2),
       ("Nick", "Fury", 13, NULL),
       ("Steve", "Rogers", 14, 13);
       ("Damian", "Wayne", 15, 6)