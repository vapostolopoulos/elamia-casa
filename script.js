document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <span class="product-price">${product.price}</span>
                        <p class="product-description">${product.description}</p>
                        <a href="#contact" class="product-btn">Inquire</a>
                    </div>
                `;

                productGrid.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p class="error-message">Unable to load products. Please ensure you are running this site on a local server (not directly from the file system) due to browser security restrictions.</p>';
        });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});