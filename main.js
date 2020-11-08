
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    /*** Fetch data from JSON ***/

    fetch("./product.json")
    .then((res) => res.json())
    .then((data) => {
        let productsList = '';
        data.items.forEach(function(items){
        var actualPrice = Number(items.price.actual);
        var discoutValue = Number(items.discount)/100;
        var afterDiscount = actualPrice - (actualPrice * discoutValue);
        var totalPrice = afterDiscount.toFixed(2);
        productsList += `
        <div class="item">
            <span class="item__offer-tag">${items.discount}%</span>
            <img class="item__img" src="${items.image}">
            <div class="item__desc">
                <h3 class="item__title">${items.name}</h3>
                <span class="item__actualPrice strike-out">$${items.price.actual}</span>
                <span class="item__totalPrice"><strong> $${totalPrice}</strong></span>
                <button onclick="addToCartClicked()" class="btn btn-primary item__button" type="button">Add to cart</button>
            </div>
        </div>
        `;
      });
      document.getElementById('productsList').innerHTML = productsList;

    })

    /*** Add to cart Functionality ***/

    function addToCartClicked() {
        var button = event.target
        var shopItem = button.parentElement.parentElement
        var title = shopItem.getElementsByClassName('item__title')[0].innerText
        var actualPrice = shopItem.getElementsByClassName('item__actualPrice')[0].innerText
        var price = shopItem.getElementsByClassName('item__totalPrice')[0].innerText
        var imageSrc = shopItem.getElementsByClassName('item__img')[0].src
        addItemToCart(title, price, imageSrc,actualPrice)
        updateCartTotal()
    }

    function removeCartItem(event) {
        var buttonClicked = event.target
        buttonClicked.parentElement.parentElement.remove()
        updateCartTotal()
    }


    /***  Checkout functionality  ***/

    function addItemToCart(title, price, imageSrc, actualPrice) {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-items')
        var cartItems = document.getElementsByClassName('cart-details')[0]
        var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText == title) {
                alert('This item is already added to the cart')
                return
            }
        }
        var cartRowContents = `
            <div class="cart-items-details">
                <img class="cart-items-details__img" src="${imageSrc}" width="100" height="100">
                <span class="cart-items_details__title">${title}</span>
                <button class="cart-items-details__button" type="button">X</button>
            </div>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="1" style="width:50px">
            </div>
            <span class="cart-price cart-column">${price}</span>
            <span class="actualPrice hidden">${actualPrice}`
        cartRow.innerHTML = cartRowContents
        cartItems.append(cartRow)
        cartRow.getElementsByClassName('cart-items-details__button')[0].addEventListener('click', removeCartItem)
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
        var cartItemContainer = document.getElementsByClassName('cart-details')[0]
        var cartRows = cartItemContainer.getElementsByClassName('cart-items')
        var totalPrice = 0
        var total = 0
        var orderTotal = 0
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i]
            var priceElement = cartRow.getElementsByClassName('cart-price')[0]
            var discountElement = cartRow.getElementsByClassName('actualPrice')[0]
            var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
            var price = parseFloat(priceElement.innerText.replace('$', ''))
            var discout = parseFloat(discountElement.innerText.replace('$', ''))
            console.log(price)
            var quantity = quantityElement.value
            total = total + (price * quantity)
            totalPrice = totalPrice + (discout * quantity)
            discount = (totalPrice - total).toFixed(2)
            orderTotal = total
        }
        total = Math.round(total * 100) / 100
        document.getElementsByClassName('cart-total-price')[0].innerText = '$' + totalPrice
        document.getElementsByClassName('cart-total-discout')[0].innerText = '$' + discount
        document.getElementsByClassName('order-details__cart-order-total')[0].innerText = '$' + orderTotal
        
    }

    
    