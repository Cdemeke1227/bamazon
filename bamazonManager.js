var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    // viewAllProducts();
    // viewLowInventory();
    // viewAllProductsADD();
    managerMenu();

});
function managerMenu() {

    inquirer.prompt([
        {
            type: "list",
            name: "option",
            message: "Select an option from the menu:",
            choices: ["View Products fo Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            filter: function (value) {
                if (value === "View Products fo Sale") {
                    return "viewAllProducts";
                } else if (value === "View Low Inventory") {
                    return "viewLowInventory";
                } else if (value === "Add to Inventory") {
                    return "viewAllProductsADD";
                } else if (value === "Add New Product") {
                    return "addNewProduct";
                } else {
                    console.log("Please select an option from the menu.");
                }
            }
        }
    ]).then(function (user) {
        console.log(user.option);
        var value = user.option;
        if (value === "viewAllProducts") {
            viewAllProducts();
        } else if (value === "viewLowInventory") {
            viewLowInventory();
        } else if (value === "viewAllProductsADD") {
            viewAllProductsADD();
        } else if (value === "addNewProduct") {
            addNewProduct();
        } else {
            console.log("Please select an option from the menu.");
        }
    });


}
function viewAllProducts() {
    var querystr = "SELECT * FROM products";
    connection.query(querystr, function (err, res) {
        if (err) throw err;
        showInventory(res);
        connection.end();
    });
}
function viewLowInventory() {
    var querystr = "SELECT * FROM products WHERE stock_quantity <= ?";
    var query = connection.query(querystr, 5, function (err, res) {
        if (err) throw err;
        showInventory(res);
        // console.log(res);
        connection.end();
    });
    // console.log(query.sql);

}
function viewAllProductsADD() {
    var querystr = "SELECT * FROM products";
    connection.query(querystr, function (err, res) {
        if (err) throw err;
        showInventory(res);
        addToInventory();

    });
}
function addToInventory() {
    inquirer.prompt([

        {
            type: "input",
            name: "item_Id",
            message: "What is the ID of the product want to update",
            // input validation to make sure number is positive interger that is on the list of items
            validate: function (value) {
                var id = Number.isInteger(parseFloat(value));
                var sign = Math.sign(value);
                if (id && sign === 1 && isNaN(value) == false && parseInt(value) > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units do you want add?",
            // input validation to make sure the number is positive integer
            validate: function (value) {
                var id = Number.isInteger(parseFloat(value));
                var sign = Math.sign(value);
                if (id && sign === 1 && isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            },
            filter: Number
        }
    ]).then(function (input) {
        var item = input.item_Id;
        var quantity = input.quantity;
        var updateQuery = `UPDATE products SET stock_quantity = stock_quantity + ${quantity} WHERE id = ${item}`;
        var update = connection.query(updateQuery, function (err, data) {
            if (err) throw err;
            console.log(" product updated!\n");
        });
        connection.end();

    });
}
function addNewProduct() {
    inquirer.prompt([

        {
            type: "input",
            name: "productName",
            message: "What name of the product?",
            filter: String
        },
        {
            type: "input",
            name: "department",
            message: "What is the product department category?",
            filter: String
        },
        {
            type: "input",
            name: "price",
            message: "What is the price of the product?",
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units do you want add?",
            // input validation to make sure the number is positive integer
            validate: function (value) {
                var id = Number.isInteger(parseFloat(value));
                var sign = Math.sign(value);
                if (id && sign === 1 && isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            },
            filter: Number
        }
    ]).then(function (input) {
        var item = input.productName;
        var department = input.department;
        var price = input.price;
        var quantity = input.quantity;

        var updateQuery = "INSERT INTO products SET ?";
        var updateQueryColumns =
            {
                product_name: item,
                department_name: department,
                price: price,
                stock_quantity: quantity
            };

        var update = connection.query(updateQuery, updateQueryColumns, function (err, data) {
            if (err) throw err;
            console.log(" product updated!\n");
        });
        console.log(update.sql);
        connection.end();
    });


}
function showInventory(res) {
    console.log("ID \t Product Name".padEnd(20) + "\t| Department Name".padEnd(10) + " \t| Price \t| Quantity");
    console.log("-----------------------------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) {
        console.log(`${res[i].id} \t| ${res[i].product_name.padEnd(20)}\t| ${res[i].department_name.padEnd(10)}\t\t| $${res[i].price}\t\t| ${res[i].stock_quantity}`);
        console.log("-----------------------------------------------------------------------------------");
    }
    console.log("-----------------------------------------------------------------------------------" + "\n\n");
}