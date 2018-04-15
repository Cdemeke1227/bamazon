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
    var order = connection.threadId;
    console.log("You are connected to the Hidden Leaf Ninja Equipment Database as order number: " + order + "\n");
    queryAllProducts();

});

function queryAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("ID" + "\t" + "Product Name".padEnd(20) + "\t| " + "Department Name".padEnd(10) + " \t| " + "Price" + " \t| " + "Quantity");
        console.log("-----------------------------------------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " \t| " + res[i].product_name.padEnd(20) + " \t| " + res[i].department_name.padEnd(10) + " \t\t| " + res[i].price + " \t\t| " + res[i].stock_quantity);
            console.log("-----------------------------------------------------------------------------------");
        }
        console.log("-----------------------------------------------------------------------------------" + "\n\n");
        userOrder(res);
    });

}

function userOrder(res) {
    inquirer.prompt([
        {
            type: "input",
            name: "item_Id",
            message: "What is the ID of the product you want"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units do you want?",
        }
    ]).then(function (user) {
        var j = user.item_Id - 1;
        var quantity = user.quantity;
        var id = res[j].id;
        var price = res[j].price;

        console.log("-----------------------------------------------------------------------------------");
        console.log(id + " \t| " + res[j].product_name.padEnd(20) + " \t| " + res[j].department_name.padEnd(10) + " \t\t| " + res[j].price + " \t\t| " + res[j].stock_quantity);
        console.log("-----------------------------------------------------------------------------------");
        if (user.quantity <= res[j].stock_quantity) {

            var rem = res[j].stock_quantity - quantity;
            console.log("id is " + id);

            // console.log("Updating all products on order \n");
            var updateQuery = 'UPDATE products SET stock_quantity =' + rem + ' WHERE id =' + id;
            var update = connection.query(updateQuery, function (err, data) {
                if (err) throw err;
                // console.log(" product updated!\n");
            }
            );
            // console.log(update.sql);
            console.log("==============================================");
            console.log("");
            console.log("You have ordered " + quantity + " " + res[j].product_name);
            console.log("");
            console.log("Your total is $" + price * quantity);
            console.log("");
            console.log("==============================================");

            connection.end();

        } else {
            console.log("==============================================");
            console.log("");
            console.log("There are " + res[j].stock_quantity + " items, we do not have enough to complete your order ");
            console.log("");
            console.log("==============================================");

        }
    });
}

// function updateProducts(res, id, rem) {
//     console.log(res);

//     var update = connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [
//             {
//                 stock_quantity: rem
//             },
//             {
//                 id: id
//             }
//         ],
//         function (err, res) {
//             console.log(res);

//             console.log(res.affectedRows +" product updated!\n");
//             // Call updateProduct AFTER the INSERT completes
//         }
//     );
//     console.log(update.sql);
// }