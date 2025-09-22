/**
 * JavaScript pour le système de témoignages
 * Gère les sliders, filtres et interactions
 */

class TestimonialsManager {
    constructor() {
        this.init();
    }

    init() {
        this.initSliders();
        this.initFilters();
        this.initLazyLoading();
    }

    /**
     * Initialise les sliders de témoignages
     */
    initSliders() {
        const sliders = document.querySelectorAll('[data-slider="testimonials"]');
        
        sliders.forEach(slider => {
            const track = slider.querySelector('.slider__track');
            const slides = slider.querySelectorAll('.slider__slide');
            const prevBtn = slider.querySelector('.slider__prev');
            const nextBtn = slider.querySelector('.slider__next');
            const dotsContainer = slider.querySelector('.slider__dots');
            
            if (!track || slides.length === 0) return;
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            const slidesToShow = this.getSlidesToShow();
            const maxIndex = Math.max(0, totalSlides - slidesToShow);
            
            // Créer les dots
            this.createDots(dotsContainer, Math.ceil(totalSlides / slidesToShow));
            
            // Fonction de mise à jour
            const updateSlider = () => {
                const translateX = -(currentIndex * (100 / slidesToShow));
                track.style.transform = `translateX(${translateX}%)`;
                
                // Mettre à jour les boutons
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= maxIndex;
                
                // Mettre à jour les dots
                this.updateDots(dotsContainer, Math.floor(currentIndex / slidesToShow));
            };
            
            // Event listeners
            prevBtn?.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
            
            nextBtn?.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                }
            });
            
            // Dots navigation
            dotsContainer?.addEventListener('click', (e) => {
                if (e.target.classList.contains('dot')) {
                    const dotIndex = Array.from(dotsContainer.children).indexOf(e.target);
                    currentIndex = dotIndex * slidesToShow;
                    if (currentIndex > maxIndex) currentIndex = maxIndex;
                    updateSlider();
                }
            });
            
            // Auto-play (optionnel)
            if (slider.dataset.autoplay === 'true') {
                setInterval(() => {
                    if (currentIndex >= maxIndex) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                    updateSlider();
                }, 5000);
            }
            
            // Initialiser
            updateSlider();
            
            // Responsive
            window.addEventListener('resize', () => {
                const newSlidesToShow = this.getSlidesToShow();
                if (newSlidesToShow !== slidesToShow) {
                    location.reload(); // Simple reload pour le responsive
                }
            });
        });
    }
    
    /**
     * Détermine le nombre de slides à afficher selon la taille d'écran
     */
    getSlidesToShow() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    /**
     * Crée les points de navigation
     */
    createDots(container, count) {
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            container.appendChild(dot);
        }
    }
    
    /**
     * Met à jour les points actifs
     */
    updateDots(container, activeIndex) {
        if (!container) return;
        
        const dots = container.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
    
    /**
     * Initialise les filtres de témoignages
     */
    initFilters() {
        const filterForm = document.querySelector('.testimonials-filters');
        if (!filterForm) return;
        
        const priorityFilter = document.getElementById('priority-filter');
        const projectFilter = document.getElementById('project-filter');
        const resetButton = document.getElementById('reset-filters');
        const container = document.getElementById('testimonials-container');
        
        if (!container) return;
        
        const testimonials = container.querySelectorAll('.testimonial-wrapper');
        
        const filterTestimonials = () => {
            const selectedPriority = priorityFilter?.value || '';
            const selectedProject = projectFilter?.value || '';
            
            let visibleCount = 0;
            
            testimonials.forEach(testimonial => {
                const testimonialPriority = testimonial.dataset.priority || 'none';
                const testimonialProject = testimonial.dataset.project || 'none';
                
                const matchesPriority = !selectedPriority || testimonialPriority === selectedPriority;
                const matchesProject = !selectedProject || testimonialProject === selectedProject;
                
                if (matchesPriority && matchesProject) {
                    testimonial.style.display = 'block';
                    testimonial.classList.add('fade-in');
                    visibleCount++;
                } else {
                    testimonial.style.display = 'none';
                    testimonial.classList.remove('fade-in');
                }
            });
            
            // Afficher un message si aucun résultat
            this.toggleNoResultsMessage(container, visibleCount === 0);
        };
        
        // Event listeners
        priorityFilter?.addEventListener('change', filterTestimonials);
        projectFilter?.addEventListener('change', filterTestimonials);
        
        resetButton?.addEventListener('click', () => {
            if (priorityFilter) priorityFilter.value = '';
            if (projectFilter) projectFilter.value = '';
            filterTestimonials();
        });
    }
    
    /**
     * Affiche/cache le message "aucun résultat"
     */
    toggleNoResultsMessage(container, show) {
        let message = container.querySelector('.no-results-message');
        
        if (show && !message) {
            message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div class="no-results-content">
                    <h3>Aucun témoignage trouvé</h3>
                    <p>Essayez de modifier vos critères de recherche.</p>
                </div>
            `;
            container.appendChild(message);
        } else if (!show && message) {
            message.remove();
        }
    }
    
    /**
     * Initialise le lazy loading pour les images
     */
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    /**
     * Méthode utilitaire pour charger plus de témoignages (AJAX)
     */
    loadMoreTestimonials(button) {
        const container = document.querySelector('.testimonials-grid');
        const page = parseInt(button.dataset.page) || 1;
        const priority = button.dataset.priority || '';
        const project = button.dataset.project || '';
        
        // Afficher le loader
        button.textContent = 'Chargement...';
        button.disabled = true;
        
        // Préparer les données
        const formData = new FormData();
        formData.append('action', 'load_more_testimonials');
        formData.append('page', page + 1);
        formData.append('priority', priority);
        formData.append('project_id', project);
        formData.append('nonce', oveco_ajax.nonce);
        
        // Requête AJAX
        fetch(oveco_ajax.url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.html) {
                // Ajouter les nouveaux témoignages
                container.insertAdjacentHTML('beforeend', data.data.html);
                
                // Mettre à jour le bouton
                button.dataset.page = page + 1;
                button.textContent = 'Charger plus';
                button.disabled = false;
                
                // Cacher le bouton s'il n'y a plus de résultats
                if (!data.data.has_more) {
                    button.style.display = 'none';
                }
                
                // Réinitialiser le lazy loading pour les nouvelles images
                this.initLazyLoading();
            } else {
                button.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement:', error);
            button.textContent = 'Erreur de chargement';
            button.disabled = false;
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsManager();
    
    // Event listener pour le bouton "Charger plus"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('load-more-testimonials')) {
            e.preventDefault();
            const manager = new TestimonialsManager();
            manager.loadMoreTestimonials(e.target);
        }
    });
});

// Fonction globale pour les shortcodes
window.OvecoTestimonials = TestimonialsManager;
