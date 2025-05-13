// This code runs when the page is loaded
window.onload = function() {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // If cart is empty, show a message
    if (cart.length === 0) {
        document.getElementById('cart-list').innerHTML = '<li>Your cart is empty.</li>';
        return;
    }

    // Display cart items
    const cartItems = cart.map(item => `
        <li>
            ${item.name} - ₹${item.price} 
            <span>Quantity: ${item.quantity || 1}</span>
        </li>
    `).join('');
    
    document.getElementById('cart-list').innerHTML = cartItems;

    // Calculate total price
    const totalPrice = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    document.getElementById('total-price').innerText = `Total: ₹${totalPrice}`;
};

// Proceed to checkout (if cart is not empty)
document.getElementById('checkout-btn').onclick = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length > 0) {
        // Redirect to the order page to complete the checkout process
        window.location.href = 'order.html';
    } else {
        alert('Your cart is empty!');
    }
};
