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

    // Contact modal elements
    const contactModal = document.getElementById('contact-modal');
    const contactClose = document.querySelector('.contact-close');

    let currentProduct = null;
    let currentImageIndex = 0;
    let currentCategory = null;
    let productsData = null;

    // --- i18n ---
    const translations = {
        en: {
            nav_collections: 'Collections',
            nav_about: 'About',
            nav_contact: 'Contact',
            hero_h1: 'Bring nature to your home',
            hero_p: 'Unique sustainable furniture custom-made designed for your home',
            hero_btn: 'View Collections',
            about_h2: 'Our Philosophy',
            about_p: 'At Elamiacasa, we believe that a beautiful home shouldn\'t come at the cost of a beautiful planet. Our collection is a tribute to conscious living, featuring handcrafted pieces born from reclaimed woods, organic textiles, and non-toxic finishes that breathe life into your space. We bridge the gap between high-end aesthetics and deep-rooted ethics, ensuring that every curve of a chair and every structural knot or grain of a table/chair tells a story of renewal and respect for the earth. By choosing furniture that is built to last a lifetime rather than fill a landfill, you aren\'t just decorating a room—you\'re cultivating a legacy of sustainability.',
            collections_title: 'Our Collections',
            back_btn: 'Back to Collections',
            inquire_btn: 'Inquire',
            contact_h3: 'Contact Us',
            follow_h3: 'Follow Us',
            footer_copy: '© 2026 All rights reserved',
        },
        el: {
            nav_collections: 'Συλλογές',
            nav_about: 'Σχετικά',
            nav_contact: 'Επικοινωνία',
            hero_h1: 'Φέρτε τη φύση στο σπίτι σας',
            hero_p: 'Μοναδικά βιώσιμα έπιπλα φτιαγμένα στα μέτρα σας',
            hero_btn: 'Δείτε τις Συλλογές',
            about_h2: 'Η Φιλοσοφία μας',
            about_p: 'Στην Elamiacasa, πιστεύουμε ότι ένα όμορφο σπίτι δεν πρέπει να έρχεται σε βάρος ενός όμορφου πλανήτη. Η συλλογή μας αποτελεί φόρο τιμής στη συνειδητή διαβίωση, με χειροποίητα κομμάτια από ανακυκλωμένα ξύλα, οργανικά υφάσματα και μη τοξικά φινιρίσματα που δίνουν ζωή στο χώρο σας. Γεφυρώνουμε το χάσμα μεταξύ υψηλής αισθητικής και βαθιά ριζωμένης ηθικής, διασφαλίζοντας ότι κάθε καμπύλη μιας καρέκλας και κάθε δομικός κόμπος ή νερό ενός τραπεζιού/καρέκλας αφηγείται μια ιστορία ανανέωσης και σεβασμού για τη γη. Επιλέγοντας έπιπλα που είναι φτιαγμένα να διαρκούν μια ζωή αντί να γεμίζουν χωματερές, δεν διακοσμείτε απλώς ένα δωμάτιο — καλλιεργείτε μια κληρονομιά βιωσιμότητας.',
            collections_title: 'Οι Συλλογές μας',
            back_btn: 'Πίσω στις Συλλογές',
            inquire_btn: 'Επικοινωνήστε',
            contact_h3: 'Επικοινωνία',
            follow_h3: 'Ακολουθήστε μας',
            footer_copy: '© 2026 Με επιφύλαξη παντός δικαιώματος',
        }
    };

    let currentLang = localStorage.getItem('lang') || 'en';

    function t(key) {
        return (translations[currentLang] && translations[currentLang][key])
            || translations['en'][key]
            || key;
    }

    function applyTranslations() {
        document.documentElement.lang = currentLang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        const toggleBtn = document.getElementById('lang-toggle');
        if (toggleBtn) toggleBtn.textContent = currentLang === 'el' ? '🇬🇧' : '🇬🇷';
    }

    function getLocalTitle(item) {
        return (currentLang === 'el' && item.title_el) ? item.title_el : item.title;
    }

    function getLocalName(category) {
        return (currentLang === 'el' && category.name_el) ? category.name_el : category.name;
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        applyTranslations();

        if (productsData) {
            if (categoryView.style.display === 'block' && currentCategory) {
                currentCategoryTitle.textContent = getLocalName(currentCategory);
                renderProducts(currentCategory.items);
            } else {
                renderCategories(productsData.categories);
            }
        }

        if (modal.style.display === 'block' && currentProduct) {
            modalTitle.textContent = getLocalTitle(currentProduct);
        }
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'el' : 'en');
        });
    }

    // Apply translations to static elements immediately
    applyTranslations();

    // Fetch and Initialize
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productsData = data;
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

            const imageSrc = category.image || 'images/placeholder.jpg';
            const name = getLocalName(category);

            catCard.innerHTML = `
                <img src="${imageSrc}" alt="${name}">
                <div class="category-overlay">
                    <span class="category-name">${name}</span>
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
        currentCategory = category;
        currentCategoryTitle.textContent = getLocalName(category);
        renderProducts(category.items);

        categoryGrid.style.display = 'none';
        categoryView.style.display = 'block';

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

            const thumbnail = product.images && product.images.length > 0 ? product.images[0] : 'images/placeholder.jpg';
            const title = getLocalTitle(product);

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${thumbnail}" alt="${title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${title}</h3>
                    <span class="product-price">${product.price}</span>
                    <p class="product-description">${product.description}</p>
                    <a href="#contact" class="product-btn">${t('inquire_btn')}</a>
                </div>
            `;

            productCard.addEventListener('click', (e) => {
                if (e.target.closest('.product-btn')) return;
                openModal(product);
            });

            const inquireBtn = productCard.querySelector('.product-btn');
            if (inquireBtn) {
                inquireBtn.removeAttribute('href');
            }

            productGrid.appendChild(productCard);
        });
    }

    // Smooth scrolling for anchor links (Nav)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.classList.contains('product-btn') || this.id === 'back-to-categories') return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Modal Functions
    function openModal(product) {
        currentProduct = product;
        currentImageIndex = 0;

        updateModalContent();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModalHandler() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        currentProduct = null;
    }

    function updateModalContent() {
        if (!currentProduct) return;

        modalTitle.textContent = getLocalTitle(currentProduct);
        modalPrice.textContent = currentProduct.price;
        modalDescription.textContent = currentProduct.description;

        if (currentProduct.images && currentProduct.images.length > 0) {
            modalImage.src = currentProduct.images[currentImageIndex];
        } else {
            modalImage.src = 'images/placeholder.jpg';
        }

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

    // Contact Modal Functions
    function openContactModal(e) {
        if (e) e.preventDefault();
        const body = document.getElementById('contact-modal-body');
        // Always re-clone so the modal reflects the current language
        body.innerHTML = '';
        const contactInfo = document.querySelector('#contact .contact-info');
        const socialMedia = document.querySelector('#contact .social-media');
        if (contactInfo) body.appendChild(contactInfo.cloneNode(true));
        if (socialMedia) body.appendChild(socialMedia.cloneNode(true));
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeContactModalHandler() {
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Event Listeners for Modal
    closeModal.addEventListener('click', closeModalHandler);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalHandler();
        }
        if (e.target === contactModal) {
            closeContactModalHandler();
        }
    });

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    if (contactClose) {
        contactClose.addEventListener('click', closeContactModalHandler);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeModalHandler();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
        if (contactModal.style.display === 'block') {
            if (e.key === 'Escape') closeContactModalHandler();
        }
    });

    // Attach contact modal to all inquire buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.product-btn')) {
            openContactModal(e);
        }
    });
});
