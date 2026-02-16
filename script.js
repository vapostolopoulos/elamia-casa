document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const categoryGrid = document.getElementById('category-grid');
    const categoryView = document.getElementById('category-view');
    const backBtn = document.getElementById('back-to-categories');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const productGrid = document.getElementById('product-grid');
    
    // Modal elements
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentProduct = null;
    let currentImageIndex = 0;

    // Fetch and Initialize
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            if (data.categories) {
                renderCategories(data.categories);
            } else {
                console.error('Invalid data structure: "categories" key missing.');
                categoryGrid.innerHTML = '<p class="error-message">Error loading categories.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading products:', error);
            categoryGrid.innerHTML = '<p class="error-message">Unable to load products. Please ensure you are running this site on a local server.</p>';
        });

    // Category Rendering
    function renderCategories(categories) {
        categoryGrid.innerHTML = '';
        categories.forEach(category => {
            const catCard = document.createElement('div');
            catCard.classList.add('category-card');
            
            // Use placeholder if no image
            const imageSrc = category.image || 'images/placeholder.jpg';

            catCard.innerHTML = `
                <img src="${imageSrc}" alt="${category.name}">
                <div class="category-overlay">
                    <span class="category-name">${category.name}</span>
                </div>
            `;
            
            catCard.addEventListener('click', () => {
                showCategory(category);
            });
            
            categoryGrid.appendChild(catCard);
        });
    }

    // View Switching
    function showCategory(category) {
        currentCategoryTitle.textContent = category.name;
        renderProducts(category.items);
        
        categoryGrid.style.display = 'none';
        categoryView.style.display = 'block';
        
        // Scroll to top of collection section
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
            collectionSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function showCategories() {
        categoryView.style.display = 'none';
        categoryGrid.style.display = 'grid';
        
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
            collectionSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    backBtn.addEventListener('click', showCategories);

    // Product Rendering
    function renderProducts(products) {
        productGrid.innerHTML = '';
        
        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found in this category.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Use the first image as the thumbnail
            const thumbnail = product.images && product.images.length > 0 ? product.images[0] : 'images/placeholder.jpg';

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${thumbnail}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <span class="product-price">${product.price}</span>
                    <p class="product-description">${product.description}</p>
                    <a href="#contact" class="product-btn">Inquire</a>
                </div>
            `;

            // Add click event to open modal
            productCard.addEventListener('click', (e) => {
                // Don't open modal if clicking the Inquire button
                if (e.target.closest('.product-btn')) return;
                
                openModal(product);
            });

            productGrid.appendChild(productCard);
        });
    }

    // Smooth scrolling for anchor links (Nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Allow default behavior for specialized buttons that might just be links
            if (this.classList.contains('product-btn') || this.id === 'back-to-categories') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Modal Functions
    function openModal(product) {
        currentProduct = product;
        currentImageIndex = 0;
        
        updateModalContent();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeModalHandler() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
        currentProduct = null;
    }

    function updateModalContent() {
        if (!currentProduct) return;

        modalTitle.textContent = currentProduct.title;
        modalPrice.textContent = currentProduct.price;
        modalDescription.textContent = currentProduct.description;
        
        if (currentProduct.images && currentProduct.images.length > 0) {
            modalImage.src = currentProduct.images[currentImageIndex];
        } else {
            modalImage.src = 'images/placeholder.jpg';
        }

        // Hide buttons if there is only one image
        if (currentProduct.images && currentProduct.images.length > 1) {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    function showNextImage() {
        if (!currentProduct || !currentProduct.images) return;
        currentImageIndex = (currentImageIndex + 1) % currentProduct.images.length;
        updateModalContent();
    }

    function showPrevImage() {
        if (!currentProduct || !currentProduct.images) return;
        currentImageIndex = (currentImageIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
        updateModalContent();
    }

    // Event Listeners for Modal
    closeModal.addEventListener('click', closeModalHandler);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeModalHandler();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
});
