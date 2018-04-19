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
    var orderNumber = connection.threadId;
    console.log(`You are connected to the Hidden Leaf Ninja Equipment Database your order number is: ${orderNumber} \n`);
    queryAllProducts(orderNumber);
});
function queryAllProducts(orderNumber) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        showInventory(res);
        userOrder(orderNumber, res);
    });
}
function userOrder(orderNumber, res) {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is your name:"
        },
        {
            type: "input",
            name: "item_Id",
            message: "What is the ID of the product you want:",
            // input validation to make sure number is positive interger that is on the list of items
            validate: function (value) {
                var id = Number.isInteger(parseFloat(value));
                var sign = Math.sign(value);
                if (id && sign === 1 && isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0) {
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
            message: "How many units do you want?",
            // input validation to make sure the number is positive integer
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
        }
    ]).then(function (user) {
        var j = user.item_Id - 1;
        var quantity = user.quantity;
        var id = res[j].id;
        var price = res[j].price;
        console.log("\nID \t| Product Name".padEnd(20) + "\t\t| Department Name".padEnd(10) + " \t| Price \t| Quantity");
        console.log("-----------------------------------------------------------------------------------");
        console.log(`${id} \t| ${res[j].product_name.padEnd(20)} \t| ${res[j].department_name.padEnd(10)} \t\t| $${res[j].price} \t\t| ${res[j].stock_quantity}`);
        console.log("-----------------------------------------------------------------------------------");
        if (user.quantity <= res[j].stock_quantity) {
            var rem = res[j].stock_quantity - quantity;
            // console.log("Updating all products on order \n");
            var updateQuery = `UPDATE products SET stock_quantity = ${rem} WHERE id = ${id}`;
            var update = connection.query(updateQuery, function (err, data) {
                if (err) throw err;
                // console.log(" product updated!\n");
            }
            );
            // console.log(update.sql);
            console.log("==============================================");
            console.log("");
            console.log(`Order transaction number HL# ${orderNumber} for ${user.name}`);

            console.log("");
            console.log(`You have ordered ${quantity} ${res[j].product_name}`);
            console.log("");
            console.log(`Your total is $${price * quantity}`);
            console.log("");
            console.log("==============================================")
            connection.end();
        } else {
            console.log("==============================================");
            console.log("");
            console.log(`There are only ${res[j].stock_quantity} ${res[j].product_name} in our inventory, we do not have enough to complete your order `);
            console.log("");
            console.log("==============================================");
            connection.end();
        }
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