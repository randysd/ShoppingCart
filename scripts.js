
// Extending Storage class with ability to set & get objects (Storage class only sets strings)
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


// This function will update the contents of the shopping cart based on the current local storage data
function updateCart(){
    var htmlCart = "";

    if (localStorage.length > 0) {
        var nTotalPrice = 0;

        for (var i=0; i<localStorage.length; i++){
            var prodID = localStorage.key(i)
            var objProd = localStorage.getObject(prodID);
            var prodName = objProd.name;
            var prodPrice = Number(objProd.price);
            var prodQty = parseInt(objProd.qty);
            var prodTotal = (prodPrice * prodQty).toFixed(2);
            htmlCart += "<tr><td>" + prodName + "</td><td>" + prodQty + "</td><td>$" + prodTotal + "</td></tr>";

            nTotalPrice += Number(prodTotal);
        }
        document.getElementById('cart_subtotal').innerHTML = "$" + nTotalPrice.toFixed(2).toString();
        document.getElementById('cart_header').style.visibility = "visible";
        document.getElementById('cart_footer').style.visibility = "visible";
    } else {
        document.getElementById('cart_header').style.visibility = "hidden";
        document.getElementById('cart_footer').style.visibility = "hidden";
        htmlCart += "<tr class='empty'><td colspan='3'>Your cart is currently empty</td></tr>";
    }

    document.getElementById('cart_content').innerHTML = htmlCart;
}


// This function will add an item to shopping cart
function addCartItem(prodID, prodName, prodPrice, qty){
    var prodQty = parseInt(qty);
    if (localStorage.getObject(prodID)){
        var objItem = localStorage.getObject(prodID);
        prodQty += parseInt(objItem.qty);                   // Add a new qty selection to the already existing qty previously selected
    }

    if (prodQty <= 0){                                      // If user entered negative number such that total is 0 or less, remove this item from the cart
        localStorage.removeItem(prodID);
    }else{
        var objProd = {
            name: prodName,
            price: prodPrice,
            qty: prodQty
        };
        localStorage.setObject(prodID, objProd);
    }
    updateCart();
};


// This function will clear the shopping cart data from local storage
function clearCart(){
    if (confirm("Do you wish to clear out your cart?")){    // Confirm if the user wants to clear out cart, in case they accidently clicked button
        localStorage.clear();
        updateCart();
    }
}


// This function will toggle the visibility of the shopping cart window 
function toggleCart(){
    var objCart = document.getElementById('cart');
    if (objCart.style.display == "none"){
        objCart.style.display = "block";
    }else{
        objCart.style.display = "none";
    }
}


// This function generates the product listing on the page from an array of product objects
function generateProductList(arrProducts){
    var htmlCatalog = "";
    for(i = 0; i < arrProducts.length; i++) {
        var prodID = arrProducts[i].id;
        var prodName = arrProducts[i].name;
        var prodDesc = arrProducts[i].description;
        var prodImg = arrProducts[i].image;
        var prodPrice = arrProducts[i].price.toFixed(2);

        // Not a fan of this method since it does not separate Model & View layers
        // If I had more time I would have explored React or Angular to dynamically create the product list from the data.
        htmlCatalog +=  "<tr>" +
                        "   <td>" +
                        "       <div class='row'>" +
                        "           <div class='col-sm-4 hidden-xs'><img src='images/" + prodImg + "' alt='" + prodName + "' class='img-responsive'/></div>" +
                        "           <div class='col-sm-8'>" +
                        "               <h4>" + prodName + "</h4>" +
                        "               <p>" + prodDesc + "</p>" +
                        "           </div>" +
                        "       </div>" +
                        "   </td>" +
                        "   <td>$" + prodPrice + "</td>" +
                        "   <td>" +
                        "       <input type='number' class='form-control text-left' value='0'>" +
                        "       <button onclick='addCartItem(\"" + prodID + "\", \"" + prodName + "\", " + prodPrice + ", this.parentElement.getElementsByTagName(\"input\")[0].value)' class='btn btn-info btn-sm'>Add to Cart</button>" +                  
                        "   </td>" +
                        "</tr>";
    }
    document.getElementById("ProductCatalog_Content").innerHTML = htmlCatalog;
}


// This function loads the Product Catalog data from a JSON file specified in the parameter.
function loadCatalog(jsonFile){
    var httpObject = new XMLHttpRequest();
    var ProductsFile = jsonFile;
    httpObject.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {       // State 4 (Done), status 200 (Success)
            var arrProducts = JSON.parse(this.responseText);
            generateProductList(arrProducts);                   // Create list of products on page
        }
    };
    httpObject.open("GET", ProductsFile, true);
    httpObject.send();
}


// This function initializes the page when it is loaded
function init(){
    loadCatalog('products.json');  // loads product data to display on page
    updateCart();   // updates cart with data from localStorage
}

init(); // Start!