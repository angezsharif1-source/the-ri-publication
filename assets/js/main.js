// ============================================================
// THE RI PUBLICATION - MAIN JAVASCRIPT
// ============================================================

(function() {
    'use strict';

    const YOUTUBE_URL = 'https://www.youtube.com/@theribiharboard?si=VaEJ_5QttXw828M8';
    let allBooks = [];
    let autoScrollIntervals = {};
    let scrollDirections = {};

    // ---------- LOAD BOOKS ----------
    async function loadBooks() {
        try {
            const response = await fetch('assets/data/books.json');
            if (!response.ok) throw new Error('Failed to load books');
            allBooks = await response.json();
            renderAll();
            setupSearch();
            animateCounters();
            setupAutoScroll();
        } catch (error) {
            console.error('Error:', error);
            allBooks = getFallbackBooks();
            renderAll();
            setupSearch();
            animateCounters();
            setupAutoScroll();
        }
    }

    function getFallbackBooks() {
        return [
            { id: 1, image: "assets/images/books/class-12/history/img1.jpg", title: "THE RI : MCQ MASTER", subject: "History", mrp: "199", series: "mcq" },
            { id: 2, image: "assets/images/books/class-12/history/img2.jpg", title: "THE RI : SUBJECTIVE MASTER", subject: "History", mrp: "199", series: "subjective" },
            { id: 3, image: "assets/images/books/class-12/history/img3.jpg", title: "THE RI : NOTES MASTER", subject: "History", mrp: "199", series: "notes" }
        ];
    }

    const seriesConfig = {
        mcq: { label: 'THE RI : MCQ MASTER', cssClass: 'mcq' },
        subjective: { label: 'THE RI : SUBJECTIVE MASTER', cssClass: 'subjective' },
        notes: { label: 'THE RI : NOTES MASTER', cssClass: 'notes' }
    };

    // ---------- SLOW + SMOOTH AUTO SCROLL ----------
    function setupAutoScroll() {
        const wrappers = document.querySelectorAll('.carousel-wrapper[data-autoscroll="true"]');
        wrappers.forEach(wrapper => {
            const container = wrapper.querySelector('.carousel-container');
            if (!container) return;

            const id = container.id;
            scrollDirections[id] = 1; // 1 = left to right, -1 = right to left

            // Clear existing interval
            if (autoScrollIntervals[id]) {
                clearInterval(autoScrollIntervals[id]);
            }

            // Start slow auto scroll
            autoScrollIntervals[id] = setInterval(() => {
                if (container) {
                    const scrollAmount = 0.5; // SLOW speed
                    container.scrollLeft += scrollAmount * scrollDirections[id];

                    // Change direction when reaching end
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                        scrollDirections[id] = -1; // Right to left
                    } else if (container.scrollLeft <= 0) {
                        scrollDirections[id] = 1; // Left to right
                    }
                }
            }, 30); // 30ms interval = smooth

            // Pause on hover
            wrapper.addEventListener('mouseenter', () => {
                if (autoScrollIntervals[id]) {
                    clearInterval(autoScrollIntervals[id]);
                }
            });

            wrapper.addEventListener('mouseleave', () => {
                // Restart auto scroll
                if (autoScrollIntervals[id]) {
                    clearInterval(autoScrollIntervals[id]);
                }
                autoScrollIntervals[id] = setInterval(() => {
                    if (container) {
                        const scrollAmount = 0.5;
                        container.scrollLeft += scrollAmount * scrollDirections[id];

                        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                            scrollDirections[id] = -1;
                        } else if (container.scrollLeft <= 0) {
                            scrollDirections[id] = 1;
                        }
                    }
                }, 30);
            });

            // Pause on touch (mobile)
            container.addEventListener('touchstart', () => {
                if (autoScrollIntervals[id]) {
                    clearInterval(autoScrollIntervals[id]);
                }
            });

            container.addEventListener('touchend', () => {
                setTimeout(() => {
                    if (autoScrollIntervals[id]) {
                        clearInterval(autoScrollIntervals[id]);
                    }
                    autoScrollIntervals[id] = setInterval(() => {
                        if (container) {
                            const scrollAmount = 0.5;
                            container.scrollLeft += scrollAmount * scrollDirections[id];

                            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
                                scrollDirections[id] = -1;
                            } else if (container.scrollLeft <= 0) {
                                scrollDirections[id] = 1;
                            }
                        }
                    }, 30);
                }, 3000);
            });
        });
    }

    // ---------- SCROLL CAROUSEL (Manual) ----------
    window.scrollCarousel = function(id, amount) {
        const container = document.getElementById(id);
        if (container) {
            container.scrollLeft += amount;
            // Pause auto scroll when manually scrolling
            if (autoScrollIntervals[id]) {
                clearInterval(autoScrollIntervals[id]);
                // Restart after 3 seconds
                setTimeout(() => {
                    if (autoScrollIntervals[id]) {
                        clearInterval(autoScrollIntervals[id]);
                    }
                    autoScrollIntervals[id] = setInterval(() => {
                        const cont = document.getElementById(id);
                        if (cont) {
                            const scrollAmount = 0.5;
                            cont.scrollLeft += scrollAmount * scrollDirections[id];

                            if (cont.scrollLeft + cont.clientWidth >= cont.scrollWidth - 5) {
                                scrollDirections[id] = -1;
                            } else if (cont.scrollLeft <= 0) {
                                scrollDirections[id] = 1;
                            }
                        }
                    }, 30);
                }, 3000);
            }
        }
    };

    // ---------- SCROLL TO SUBJECT ----------
    window.scrollToSubject = function(subject) {
        const el = document.getElementById('mcq');
        if (el) {
            const offset = 120;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    };

    // ---------- ANIMATE COUNTERS ----------
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (!target) return;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 50));
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const interval = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target + '+';
                                clearInterval(interval);
                                return;
                            }
                            counter.textContent = current + '+';
                        }, 30);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(counter);
        });
    }

    // ---------- MODAL ----------
    let currentBook = null;

    window.openOrderModal = function(bookId) {
        const book = allBooks.find(b => b.id === bookId);
        if (!book) return;
        currentBook = book;
        document.getElementById('modalBookName').textContent = book.title + ' - ' + book.subject;
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
        if (!phone || phone.length < 10) { alert('Please enter a valid 10-digit phone number.'); return; }
        if (!quantity || quantity < 10) { alert('Minimum order quantity is 10 books.'); return; }
        if (!address) { alert('Please enter your delivery address.'); return; }
        if (!city) { alert('Please enter your city.'); return; }
        if (!pincode || pincode.length < 6) { alert('Please enter a valid 6-digit pincode.'); return; }

        const bookName = currentBook ? currentBook.title + ' - ' + currentBook.subject : 'Book';
        const totalPrice = currentBook ? parseInt(currentBook.mrp) * quantity : quantity * 199;

        const message = `
📚 NEW BOOK ORDER - THE RI PUBLICATION
─────────────────────────
📖 Book: ${bookName}
📦 Quantity: ${quantity} books
💰 Total: ₹${totalPrice} (₹${currentBook ? currentBook.mrp : '199'} × ${quantity})
─────────────────────────
👤 Customer:
Name: ${name}
Phone: ${phone}
─────────────────────────
📍 Address:
${address}
City: ${city}
Pincode: ${pincode}
─────────────────────────
📝 Note: ${note || 'N/A'}
─────────────────────────
✅ Please confirm availability & delivery charges.
        `.trim();

        const encoded = encodeURIComponent(message);
        closeOrderModal();
        window.open('https://wa.me/916203309502?text=' + encoded, '_blank');
    };

    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) closeOrderModal();
    });

    // ---------- RENDER CAROUSEL ----------
    function renderCarousel(containerId, seriesKey) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const filtered = allBooks.filter(b => b.series === seriesKey);
        const cfg = seriesConfig[seriesKey] || seriesConfig.mcq;

        if (filtered.length === 0) {
            container.innerHTML = '<p style="padding:20px; color:#4A5568;">No books found.</p>';
            return;
        }

        container.innerHTML = filtered.map(b => {
            const imgSrc = b.image || '';
            return `
                <div class="carousel-item">
                    <div class="book-cover">
                        ${imgSrc ? `<img src="${imgSrc}" alt="${b.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='📘';">` : '📘'}
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

    function renderAll() {
        renderCarousel('mcqCarousel', 'mcq');
        renderCarousel('subjectiveCarousel', 'subjective');
        renderCarousel('notesCarousel', 'notes');
    }

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
                if (!query || filtered.length === 0) {
                    if (!query) { renderCarousel(id, seriesKey); return; }
                    container.innerHTML = '<p style="padding:20px; color:#4A5568;">No books found for "' + query + '"</p>';
                    return;
                }
                container.innerHTML = filtered.map(b => {
                    const imgSrc = b.image || '';
                    return `
                        <div class="carousel-item">
                            <div class="book-cover">
                                ${imgSrc ? `<img src="${imgSrc}" alt="${b.title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='📘';">` : '📘'}
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

    // ---------- HEADER SCROLL ----------
    function setupHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // ---------- SCROLL TOP ----------
    function setupScrollTop() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 400);
        });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // ---------- ANCHORS ----------
    function setupAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ---------- LOADER ----------
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) setTimeout(() => loader.classList.add('hidden'), 800);
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
