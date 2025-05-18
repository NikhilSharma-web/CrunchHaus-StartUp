let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart in Local Storage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to handle adding items to the cart
function addToCart(itemName, itemPrice) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCart();
    alert(`${itemName} added to cart!`);
}

// Event listeners for Add to Cart buttons (example)
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const itemName = e.target.dataset.name;
        const itemPrice = parseFloat(e.target.dataset.price);
        addToCart(itemName, itemPrice);
    });
});

// Event listener for View Cart
const viewCartButton = document.getElementById('view-cart-btn');
if (viewCartButton) {
    viewCartButton.addEventListener('click', () => {
        window.location.href = 'html/menu.html';
    });
}
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
        alert(params.get('error'));
    }
    if (params.has('success')) {
        alert(params.get('success'));
        // Optional: remove query params from URL after alert
        history.replaceState(null, '', window.location.pathname);
    }
});
