// טעינת תמונות מראש בזיכרון (Cache)
products.forEach((product) => {
    const img = new Image();
    img.src = product.image;
});
// פתיחת וסגירת תפריט במובייל
function toggleMenu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}


$(document).ready(function() {
    function buildCarousel(carouselArray, slidesToShow = 3) {
        const carouselContainer = $('.carousel');

        carouselContainer.empty();

        carouselArray.forEach((id) => {
            const product = products.find(p => p.ID_prodact == String(id));
            if (product) {
                const item = `
                    <div class="carousel-item" data-id="${product.ID_prodact}">
                        <img class="product-img"
                            src="${product.image}"
                            data-default="${product.image}"
                            data-qr="${product.qr}"
                            alt="${product.name}">
                        <p>${product.name}</p>
                    </div>
                `;
                carouselContainer.append(item);
            }
        });

        if (carouselContainer.children().length > 0) {
            $('.lazy').slick({
                lazyLoad: 'ondemand',
                slidesToShow: slidesToShow,
                slidesToScroll: 1,
                arrows: true,
                dots: true,
                infinite: true,
                draggable: true,
                prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button">❯</button>',
                nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button">❮</button>',
                responsive: [
                    {
                        breakpoint: 768,  // מתחת ל-768px – מובייל
                        settings: {
                            slidesToShow: 1,
                            centerPadding: '10px', // רווח בין הפריטים
                            slidesToScroll: 1,
                            centerMode: true,
                            variableWidth: false  // כיבוי כדי שהתמונות יהיו באותו גודל
                        }
                    }
                ]
            });

            // הסרת display: block וטעינה מחדש
            $('.slick-slide').css('display', 'none');

            let imagesLoaded = 0;
            const totalImages = $('.product-img').length;

            console.log(`Total images to load: ${totalImages}`);

            $('.product-img').each(function() {
                const img = new Image();
                img.src = $(this).attr('src');

                img.onload = function() {
                    imagesLoaded++;
                    console.log(`Image loaded: ${img.src}`);
                    if (imagesLoaded === totalImages) {
                        console.log('All images loaded - refreshing slick');
                        $('.slick-slide').css('display', 'block');
                        $('.lazy').slick('setPosition');  // רענון slick כדי להבטיח הצגה נכונה
                    }
                };

                img.onerror = function() {
                    console.error(`Failed to load image: ${img.src}`);
                };
            });
        }
    }

    buildCarousel(carousel_1, 3);  // הפעלת קרוסלה כברירת מחדל עם 3 תמונות
});



    // מעבר עם העכבר - הצגת QR
    $('.carousel-container').on('mouseenter', '.product-img', function() {
        const qr = $(this).attr('data-qr');
        $(this).attr('src', qr);
    });

    $('.carousel-container').on('mouseleave', '.product-img', function() {
        const original = $(this).attr('data-default');
        $(this).attr('src', original);
    });

// פתיחת פופ-אפ בלחיצה על מוצר
$('.carousel-container').on('click', '.slick-slide img', function() {
    const id = $(this).closest('.carousel-item').data('id');
    const product = products.find(p => p.ID_prodact == String(id));

    if (product) {
        $('#popup-main-img').attr('src', product.image);
        $('#popup-title').text(product.name);
        $('#popup-description').text(product.description);
        $('#popup-price').text(`${product.price} ₪`);
        $('#popup-extra-photos').empty();

        const extraPhotos = product.extra_photos || [];
        extraPhotos.forEach(photo => {
            $('#popup-extra-photos').append(`
                <img class="extra-photo" src="${photo}" alt="תמונה נוספת">
            `);
        });

        $('#popup-overlay').fadeIn();
    }
});

// החלפת תמונה ראשית בעת לחיצה על תמונה קטנה
$('#popup-extra-photos').on('click', '.extra-photo', function() {
    const mainImg = $('#popup-main-img');
    const newSrc = $(this).attr('src');
    const currentSrc = mainImg.attr('src');

    // החלפה בין התמונה הראשית לקטנה
    mainImg.attr('src', newSrc);
    $(this).attr('src', currentSrc);
});

// סגירת פופ-אפ בלחיצה על X או על הרקע
$('#popup-overlay').on('click', function(event) {
    if (event.target === this || event.target.classList.contains('popup-close')) {
        $('#popup-overlay').fadeOut();
    }
});



