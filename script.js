document.addEventListener('DOMContentLoaded', () => {
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

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const products = data.items;
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
        })
        .catch(error => {
            console.error('Error loading products:', error);
            productGrid.innerHTML = '<p class="error-message">Unable to load products. Please ensure you are running this site on a local server (not directly from the file system) due to browser security restrictions.</p>';
        });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
