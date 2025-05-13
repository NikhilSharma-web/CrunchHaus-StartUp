document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalPrice = localStorage.getItem('totalPrice') || 0;

    // Inject cart into a new <ul>
    const cartContainer = document.createElement('div');
    const orderList = document.createElement('ul');
    orderList.id = 'order-list';

    const totalDisplay = document.createElement('p');
    totalDisplay.id = 'total-price';
    totalDisplay.textContent = `Total: ₹${Number(totalPrice).toFixed(2)} + ₹50.00 (Delivery Charges) = ₹${(Number(totalPrice) + 50).toFixed(2)} (Total)`;

    if (cartItems.length > 0) {
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ₹${item.price} x ${item.quantity}`;
            orderList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'Your cart is empty.';
        orderList.appendChild(li);
    }

    cartContainer.appendChild(orderList);
    cartContainer.appendChild(totalDisplay);

    const form = document.getElementById('order-form');
    form.parentNode.insertBefore(cartContainer, form);

    // Submit order
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;

        if (!name || !address || !phone || !paymentMethod || cartItems.length === 0) {
            alert('Please fill out all fields and make sure cart is not empty.');
            return;
        }

        const orderData = {
            name,
            address,
            phone,
            paymentMethod,
            items: cartItems,
            totalPrice: Number(totalPrice)
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) throw new Error('Failed to place order');

            alert('✅ Order placed successfully!');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('totalPrice');
            window.location.href = '../index.html'; // or show a thank-you page
        } catch (err) {
            console.error('❌ Error placing order:', err.message);
            alert('❌ Failed to place order. Try again later.');
        }
    });
});
