const cartList = document.getElementById('cart-list');

function addToCart(name, price) {
  if (cartList.innerHTML === '<li>Cart is empty</li>') {
    cartList.innerHTML = '';
  }
  cartList.innerHTML += `<li>${name} - ${price}</li>`;
}

fetch('products.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('product-list');
    data.forEach(product => {
      list.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p>Price: ${product.price}</p>
          <button onclick="addToCart('${product.name}', '${product.price}')">Add to Cart</button>
        </div>
      `;
    });
  });
