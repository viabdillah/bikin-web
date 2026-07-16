/**
 * main.js
 * Entry point untuk interaktivitas UI bikin.web
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       1. AMBIENT BACKGROUND PARALLAX
       ========================================= */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const blobs = document.querySelectorAll('.blob');
    let isTicking = false;

    // Fungsi kalkulasi parallax
    function updateParallax() {
        const scrollY = window.scrollY;
        blobs.forEach(blob => {
            const speed = parseFloat(blob.getAttribute('data-speed'));
            // Geser posisi Y sesuai kecepatan (speed) masing-masing blob
            blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        isTicking = false;
    }

    // Hanya jalankan animasi scroll jika user TIDAK mengaktifkan "reduce motion" di OS-nya
    if (!prefersReducedMotion.matches) {
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(updateParallax);
                isTicking = true;
            }
        }, { passive: true }); // passive: true untuk performa scroll yang lebih baik
    }
       
       
        /* =========================================
       2. SCROLL REVEAL (Intersection Observer)
       ========================================= */
    const revealOptions = {
        threshold: 0.1, // Trigger saat 10% bagian elemen terlihat di layar
        rootMargin: "0px 0px -50px 0px" // Trigger sedikit sebelum elemen benar-benar menyentuh bawah layar
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Hapus class hidden/geser, tambahkan class tampil normal
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
                
                // Hentikan observasi setelah elemen muncul (agar animasi hanya 1x jalan)
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Ambil semua elemen dengan class 'reveal-target' dan amati
    const revealElements = document.querySelectorAll('.reveal-target');
    revealElements.forEach(el => revealObserver.observe(el));
       
       
    /* =========================================
       3. FAQ ACCORDION
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-btn');
        
        btn.addEventListener('click', () => {
            // Cek apakah item yang diklik sedang terbuka
            const isOpen = item.classList.contains('is-open');
            
            // 1. Tutup SEMUA item terlebih dahulu
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('is-open');
            });
            
            // 2. Jika item yang diklik sebelumnya tertutup, maka buka
            // (Jika sudah terbuka, biarkan saja tertutup dari langkah 1)
            if (!isOpen) {
                item.classList.add('is-open');
            }
        });
    });
       
       
    /* =========================================
       4. CONTACT FORM & WHATSAPP GENERATOR
       ========================================= */
    const contactForm = document.getElementById('contact-form');
    const errorBox = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form reload halaman

            // Ambil elemen input
            const nameInput = document.getElementById('form-name');
            const contactInput = document.getElementById('form-contact');
            const packageInput = document.getElementById('form-package');
            const briefInput = document.getElementById('form-brief');

            // Ambil value dan bersihkan spasi kosong (trim)
            const nameVal = nameInput.value.trim();
            const contactVal = contactInput.value.trim();
            const packageVal = packageInput.value;
            const briefVal = briefInput.value.trim();

            // Validasi ringan
            if (!nameVal || !contactVal) {
                errorBox.textContent = "Nama Lengkap dan Kontak wajib diisi.";
                errorBox.classList.remove('hidden');
                
                // Tambahkan border merah ke input yang kosong
                if (!nameVal) nameInput.classList.add('border-red-500');
                if (!contactVal) contactInput.classList.add('border-red-500');
                return; // Hentikan eksekusi jika tidak valid
            }

            // Bersihkan error jika sudah valid
            errorBox.classList.add('hidden');
            nameInput.classList.remove('border-red-500');
            contactInput.classList.remove('border-red-500');

            // Susun template pesan
            const message = `Halo bikin.web! Saya tertarik untuk diskusi mengenai pembuatan website.\n\n` +
                            `*Nama:* ${nameVal}\n` +
                            `*Kontak:* ${contactVal}\n` +
                            `*Paket Diminati:* ${packageVal}\n` +
                            `*Brief/Kebutuhan:* \n${briefVal ? briefVal : '-'}\n\n` +
                            `Mohon info lebih lanjut. Terima kasih!`;

            // TODO: ganti nomor WhatsApp di bawah ini dengan nomor asli Anda
            const WHATSAPP_NUMBER = "6285180590833"; 
            
            // Encode pesan agar aman dikirim via URL
            const encodedMessage = encodeURIComponent(message);
            
            // Buka tab baru ke WhatsApp
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(waUrl, '_blank');
        });

        // Hapus border merah saat user mulai mengetik lagi
        ['form-name', 'form-contact'].forEach(id => {
            document.getElementById(id).addEventListener('input', function() {
                this.classList.remove('border-red-500');
                errorBox.classList.add('hidden');
            });
        });
    }

    /* =========================================
       5. MARQUEE DUPLICATION & ICONS
       ========================================= */
    const track = document.getElementById('tech-track');
    
    // Duplikat konten untuk animasi seamless (Hanya jika pengguna tidak menyalakan reduced-motion)
    if (track && !prefersReducedMotion.matches) {
        const items = track.querySelector('.tech-items');
        track.appendChild(items.cloneNode(true));
    }
    
    // Inisialisasi ikon Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* =========================================
       6. HERO MORPH STATUS TAG SCRIPT
       ========================================= */
    const morphTag = document.querySelector('.morph-tag');
    
    // Ganti teks hanya jika user tidak mengaktifkan reduce-motion
    if (morphTag && !prefersReducedMotion.matches) {
        const stages = [
            'wireframe...', 
            'membangun UI...', 
            'diskusi revisi...', 
            'menerapkan revisi...', 
            'live & deploy ✓'
        ];
        let stageIndex = 0;
        
        setInterval(() => {
            stageIndex = (stageIndex + 1) % stages.length;
            morphTag.textContent = 'status: ' + stages[stageIndex];
        }, 4000); 
    } else if (morphTag && prefersReducedMotion.matches) {
        // Jika animasi dimatikan, tampilkan teks final
        morphTag.textContent = 'status: live & deploy ✓';
    }
       
});