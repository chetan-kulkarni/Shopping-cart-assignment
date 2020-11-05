
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    fetch("./product.json")
    .then((res) => res.json())
    .then((data) => {
        let output = '';
        data.items.forEach(function(items){
        var actualPrice = Number(items.price.actual);
        var discoutValue = Number(items.discount)/100;
        var afterDiscount = actualPrice - (actualPrice * discoutValue);
        var totalPrice = afterDiscount.toFixed(2);
        output += `
        <div class="shop-item">
        <span class="offer-tag">${items.discount}%</span>
            <img class="shop-item-image" src="${items.image}">
                <div class="shop-item-details">
                    <span class="shop-item-title">${items.name}</span>
                    <span class="shop-item-price strike-out">$${items.price.actual}</span>
                    <span class="shop-item-price totalPrice"><strong> $${totalPrice}</strong></span>
                    <button onclick="addToCartClicked()" class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
                </div>
        </div>
        `;
      });
      document.getElementById('output').innerHTML = output;

    })

    function addToCartClicked() {
        console.log("item clicked");
        var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('totalPrice')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
    }
    
    function removeCartItem(event) {
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    }

    function addItemToCart(title, price, imageSrc) {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        var cartItems = document.getElementsByClassName('cart-items')[0]
        var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText == title) {
                alert('This item is already added to the cart')
                return
            }
        }
        var cartRowContents = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
                <span class="cart-item-title">${title}</span>
                <button class="btn btn-danger" type="button">X</button>
            </div>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1" style="width:50px">
            </div>
            <span class="cart-price cart-column">${price}</span>`
        cartRow.innerHTML = cartRowContents
        cartItems.append(cartRow)
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    }
    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        updateCartTotal()
    }
    
    function updateCartTotal() {
        var cartItemContainer = document.getElementsByClassName('cart-items')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-row')
        var total = 0
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var priceElement = cartRow.getElementsByClassName('cart-price')[0]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var price = parseFloat(priceElement.innerText.replace('$', ''))
            var quantity = quantityElement.value
            total = total + (price * quantity)
        }
        total = Math.round(total * 100) / 100
        document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    }

    