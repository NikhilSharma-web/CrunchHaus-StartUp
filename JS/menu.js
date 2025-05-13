document.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cart-list');
    const totalPriceElement = document.getElementById('total-price');
    const goToOrdersBtn = document.getElementById('go-to-orders-btn');
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

    const saveCart = () => {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        localStorage.setItem('totalPrice', calculateTotal());
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const updateCartDisplay = () => {
        cartList.innerHTML = '';
        let total = calculateTotal();
        totalPriceElement.textContent = `Total: ₹${total}`;

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - ₹${item.price} x ${item.quantity}

                <button class="increase-btn">+</button>
                <button class="decrease-btn">-</button>
                <button class="delete-btn">Delete</button>
            `;

            // Increase quantity
            li.querySelector('.increase-btn').addEventListener('click', () => {
                item.quantity += 1;
                updateCartDisplay();
                saveCart();
            });

            // Decrease quantity
            li.querySelector('.decrease-btn').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart.splice(index, 1);
                    resetButton(item.name); // Reset "Add to Cart" button
                }
                updateCartDisplay();
                saveCart();
            });

            // Delete item
            li.querySelector('.delete-btn').addEventListener('click', () => {
                cart.splice(index, 1);
                updateCartDisplay();
                saveCart();
                resetButton(item.name);
            });

            cartList.appendChild(li);
        });
    };

    const markButtonAdded = (name) => {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            if (button.dataset.name === name) {
                button.textContent = 'Added to Cart ✅';
                button.disabled = true;
            }
        });
    };

    const resetButton = (name) => {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            if (button.dataset.name === name) {
                button.textContent = 'Add to Cart';
                button.disabled = false;
            }
        });
    };

    // Add to Cart Button Handler
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);
            const existing = cart.find(item => item.name === name);

            if (existing) {
                existing.quantity += 1;
            } else {
                const newItem = {
                    name,
                    price,
                    quantity: 1
                };
                cart.push(newItem);

                // Save to MongoDB
                try {
                    const response = await fetch('http://127.0.0.1:8000/menu', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newItem),
                    });

                    if (!response.ok) throw new Error('Failed to save menu item');
                    console.log('✅ Item saved to DB:', newItem);
                } catch (err) {
                    console.error('❌ Error saving to DB:', err.message);
                }
            }

            updateCartDisplay();
            saveCart();
            markButtonAdded(name);
        });
    });

    // Load cart if already present
    updateCartDisplay();

    // Go to order page
    goToOrdersBtn.addEventListener('click', () => {
        saveCart(); // Just to make sure
        window.location.href = 'order.html';
    });
});
