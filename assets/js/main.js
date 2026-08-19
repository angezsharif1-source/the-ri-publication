// ============================================================
// THE RI PUBLICATION - MAIN JAVASCRIPT
// ============================================================

(function() {
    'use strict';

    // ---------- YOUTUBE CHANNEL URL ----------
    const YOUTUBE_URL = 'https://www.youtube.com/@theribiharboard?si=VaEJ_5QttXw828M8';

    // ---------- FETCH BOOKS FROM JSON ----------
    let allBooks = [];

    async function loadBooks() {
        try {
            const response = await fetch('assets/data/books.json');
            if (!response.ok) throw new Error('Failed to load books.json');
            allBooks = await response.json();
            renderAllCarousels();
            setupSearch();
            animateCounters();
        } catch (error) {
            console.error('Error loading books:', error);
            allBooks = getFallbackBooks();
            renderAllCarousels();
            setupSearch();
            animateCounters();
        }
    }

    // ---------- FALLBACK BOOKS ----------
    function getFallbackBooks() {
        return [
            { id: 1, image: "assets/images/books/class-10/mathematics/math-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Mathematics", mrp: "199", series: "mcq", class: "10" },
            { id: 2, image: "assets/images/books/class-10/science/science-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Science", mrp: "199", series: "mcq", class: "10" },
            { id: 3, image: "assets/images/books/class-10/social-science/social-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Social Science", mrp: "199", series: "mcq", class: "10" },
            { id: 4, image: "assets/images/books/class-10/english/english-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "English", mrp: "199", series: "mcq", class: "10" },
            { id: 5, image: "assets/images/books/class-10/hindi/hindi-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Hindi", mrp: "199", series: "mcq", class: "10" },
            { id: 6, image: "assets/images/books/class-10/urdu/urdu-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Urdu", mrp: "199", series: "mcq", class: "10" },
            { id: 7, image: "assets/images/books/class-12/history/history-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "History", mrp: "199", series: "mcq", class: "12" },
            { id: 8, image: "assets/images/books/class-12/geography/geography-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Geography", mrp: "199", series: "mcq", class: "12" },
            { id: 9, image: "assets/images/books/class-12/political-science/pol-science-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Political Science", mrp: "199", series: "mcq", class: "12" },
            { id: 10, image: "assets/images/books/class-12/economics/economics-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Economics", mrp: "199", series: "mcq", class: "12" },
            { id: 11, image: "assets/images/books/class-12/english/english-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "English", mrp: "199", series: "mcq", class: "12" },
            { id: 12, image: "assets/images/books/class-12/hindi/hindi-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Hindi", mrp: "199", series: "mcq", class: "12" },
            { id: 13, image: "assets/images/books/class-12/urdu/urdu-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "Urdu", mrp: "199", series: "mcq", class: "12" },
            { id: 14, image: "assets/images/books/competitive/upsc/upsc-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "UPSC", mrp: "299", series: "mcq", class: "competitive" },
            { id: 15, image: "assets/images/books/competitive/bpsc/bpsc-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "BPSC", mrp: "299", series: "mcq", class: "competitive" },
            { id: 16, image: "assets/images/books/competitive/ssc/ssc-mcq-master.jpg", title: "THE RI : MCQ MASTER", subject: "SSC", mrp: "299", series: "mcq", class: "competitive" }
        ];
    }

    // Series Config
    const seriesConfig = {
        mcq: { label: 'THE RI : MCQ MASTER', cssClass: 'mcq', color: '#1565C0' },
        subjective: { label: 'THE RI : SUBJECTIVE MASTER', cssClass: 'subjective', color: '#2E7D32' },
        notes: { label: 'THE RI : NOTES MASTER', cssClass: 'notes', color: '#E65100' }
    };

    // ---------- ANIMATE COUNTERS ----------
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target) return;
            const duration = 1500;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;
            const increment = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + '+';
                    return;
                }
                counter.textContent = current + '+';
                requestAnimationFrame(increment);
            };
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        increment();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(counter);
        });
    }

    // ---------- MODAL FUNCTIONS ----------
    let currentBook = null;

    window.openOrderModal = function(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (!book) return;
        currentBook = book;
        document.getElementById('modalBookName').textContent = `${book.title} - ${book.subject}`;
        document.getElementById('orderQuantity').value = 10;
        document.getElementById('orderName').value = '';
        document.getElementById('orderPhone').value = '';
        document.getElementById('orderAddress').value = '';
        document.getElementById('orderCity').value = '';
        document.getElementById('orderPincode').value = '';
        document.getElementById('orderNote').value = '';
        document.getElementById('orderModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeOrderModal = function() {
        document.getElementById('orderModal').classList.remove('active');
        document.body.style.overflow = '';
    };

    window.sendOrder = function() {
        const name = document.getElementById('orderName').value.trim();
        const phone = document.getElementById('orderPhone').value.trim();
        const quantity = parseInt(document.getElementById('orderQuantity').value);
        const address = document.getElementById('orderAddress').value.trim();
        const city = document.getElementById('orderCity').value.trim();
        const pincode = document.getElementById('orderPincode').value.trim();
        const note = document.getElementById('orderNote').value.trim();

        if (!name) { alert('Please enter your full name.'); return; }
        if (!phone) { alert('Please enter your phone number.'); return; }
        if (phone.length < 10) { alert('Please enter a valid 10-digit phone number.'); return; }
        if (!quantity || quantity < 10) { alert('Minimum order quantity is 10 books.'); return; }
        if (!address) { alert('Please enter your delivery address.'); return; }
        if (!city) { alert('Please enter your city.'); return; }
        if (!pincode || pincode.length < 6) { alert('Please enter a valid 6-digit pincode.'); return; }

        const bookName = currentBook ? `${currentBook.title} - ${currentBook.subject}` : 'Book';
        const totalPrice = currentBook ? parseInt(currentBook.mrp) * quantity : quantity * 149;

        const message = `
📚 *NEW BOOK ORDER - THE RI PUBLICATION*
─────────────────────────
📖 *Book:* ${bookName}
📦 *Quantity:* ${quantity} books
💰 *Total Amount:* ₹${totalPrice} (₹${currentBook ? currentBook.mrp : '149'} × ${quantity})
─────────────────────────
👤 *Customer Details:*
• Name: ${name}
• Phone: ${phone}
─────────────────────────
📍 *Delivery Address:*
${address}
City: ${city}
Pincode: ${pincode}
─────────────────────────
📝 *Additional Note:*
${note || 'N/A'}
─────────────────────────
✅ *Order Confirmation Required*
Please confirm availability & delivery charges.
        `.trim();

        const encodedMsg = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/916203309502?text=${encodedMsg}`;

        closeOrderModal();
        window.open(whatsappUrl, '_blank');
    };

    // Click outside modal to close
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('orderModal');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) closeOrderModal();
            });
        }
    });

    // ---------- RENDER CAROUSEL ----------
    function renderCarousel(containerId, seriesKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const filtered = allBooks.filter(b => b.series === seriesKey);
        const cfg = seriesConfig[seriesKey] || seriesConfig.mcq;

        if (filtered.length === 0) {
            container.innerHTML = `<p style="padding:20px; color:var(--text-light); text-align:center;">No books found in this series.</p>`;
            return;
        }

        container.innerHTML = filtered.map(b => {
            const imgSrc = b.image || '';
            return `
                <div class="carousel-item">
                    <div class="book-cover">
                        ${imgSrc ? `<img src="${imgSrc}" alt="${b.title} ${b.subject}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='#E6EEF9'; this.parentElement.innerHTML='📘';">` : '📘'}
                    </div>
                    <div class="series-tag ${cfg.cssClass}">${cfg.label}</div>
                    <h4>${b.title}</h4>
                    <div class="subject">${b.subject}</div>
                    <div class="price">₹${b.mrp}</div>
                    <div class="actions">
                        <button class="btn-xs" onclick="openOrderModal(${b.id})"><i class="fas fa-shopping-cart"></i> Buy</button>
                        <button class="btn-xs btn-xs-demo" onclick="window.open('${YOUTUBE_URL}','_blank')"><i class="fas fa-play"></i> Demo</button>
                        <button class="btn-xs btn-xs-outline" onclick="window.open('${YOUTUBE_URL}','_blank')"><i class="fas fa-eye"></i> View</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderAllCarousels() {
        renderCarousel('mcqCarousel', 'mcq');
        renderCarousel('subjectiveCarousel', 'subjective');
        renderCarousel('notesCarousel', 'notes');
    }

    // ---------- SCROLL ----------
    window.scrollCarousel = function(containerId, amount) {
        const container = document.getElementById(containerId);
        if (container) {
            container.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    // ---------- SEARCH ----------
    function setupSearch() {
        const input = document.getElementById('globalSearch');
        const btn = document.getElementById('searchBtn');
        if (!input || !btn) return;

        const doSearch = () => {
            const query = input.value.toLowerCase().trim();
            ['mcqCarousel', 'subjectiveCarousel', 'notesCarousel'].forEach(id => {
                const container = document.getElementById(id);
                if (!container) return;
                const seriesKey = id.replace('Carousel', '');
                const filtered = allBooks.filter(b => 
                    b.series === seriesKey &&
                    (b.title.toLowerCase().includes(query) || b.subject.toLowerCase().includes(query))
                );
                const cfg = seriesConfig[seriesKey] || seriesConfig.mcq;
                if (filtered.length === 0 || query === '') {
                    if (query === '') {
                        // Reset to show all
                        renderCarousel(id, seriesKey);
                        return;
                    }
                    container.innerHTML = `<p style="padding:20px; color:var(--text-light); text-align:center;">No books found for "${query}"</p>`;
                    return;
                }
                container.innerHTML = filtered.map(b => {
                    const imgSrc = b.image || '';
                    return `
                        <div class="carousel-item">
                            <div class="book-cover">
                                ${imgSrc ? `<img src="${imgSrc}" alt="${b.title} ${b.subject}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='#E6EEF9'; this.parentElement.innerHTML='📘';">` : '📘'}
                            </div>
                            <div class="series-tag ${cfg.cssClass}">${cfg.label}</div>
                            <h4>${b.title}</h4>
                            <div class="subject">${b.subject}</div>
                            <div class="price">₹${b.mrp}</div>
                            <div class="actions">
                                <button class="btn-xs" onclick="openOrderModal(${b.id})"><i class="fas fa-shopping-cart"></i> Buy</button>
                                <button class="btn-xs btn-xs-demo" onclick="window.open('${YOUTUBE_URL}','_blank')"><i class="fas fa-play"></i> Demo</button>
                                <button class="btn-xs btn-xs-outline" onclick="window.open('${YOUTUBE_URL}','_blank')"><i class="fas fa-eye"></i> View</button>
                            </div>
                        </div>
                    `;
                }).join('');
            });
        };

        btn.addEventListener('click', doSearch);
        input.addEventListener('keyup', (e) => { if (e.key === 'Enter') doSearch(); });
        input.addEventListener('input', doSearch);
    }

    // ---------- HEADER SCROLL EFFECT ----------
    function setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ---------- SCROLL TO TOP ----------
    function setupScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- MOBILE MENU ----------
    function setupMobileMenu() {
        const toggle = document.getElementById('mobileToggle');
        const nav = document.querySelector('.nav');
        if (!toggle || !nav) return;
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            toggle.innerHTML = nav.classList.contains('open') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ---------- LOADER ----------
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 800);
        }
    }

    // ---------- ANCHORS ----------
    function setupAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ---------- INIT ----------
    document.addEventListener('DOMContentLoaded', function() {
        loadBooks();
        setupHeaderScroll();
        setupScrollTop();
        setupMobileMenu();
        setupAnchors();
        hideLoader();
    });

})();