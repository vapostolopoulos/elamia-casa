const products = [
    {
        id: 1,
        title: "Oak Minimalist Stool",
        price: "$120",
        description: "Hand-carved from solid oak, this stool features a smooth finish and sturdy construction. Perfect for any room.",
        image: "https://images.unsplash.com/photo-1503602642458-232111445857?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Ceramic Artisan Vase",
        price: "$85",
        description: "A unique, hand-thrown ceramic vase with a textured matte glaze. Adds an earthy touch to your decor.",
        image: "https://images.unsplash.com/photo-1581783342308-f792cca04d86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Walnut Coffee Table",
        price: "$450",
        description: "Elegant mid-century modern inspired coffee table. Made from sustainable walnut wood with tapered legs.",
        image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Woven Jute Basket",
        price: "$45",
        description: "Natural jute basket, hand-woven by skilled artisans. Ideal for storage or as a planter cover.",
        image: "https://images.unsplash.com/photo-1595861678122-263a033c563e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Rustic Wooden Bowl",
        price: "$55",
        description: "One-of-a-kind wooden bowl, perfect for fruit or serving salads. Treated with food-safe oil.",
        image: "https://images.unsplash.com/photo-1603539829871-2e18e8df575e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Modern Side Table",
        price: "$180",
        description: "Sleek and functional side table with a metal base and reclaimed wood top.",
        image: "https://images.unsplash.com/photo-1532323544230-7191fd510c59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

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