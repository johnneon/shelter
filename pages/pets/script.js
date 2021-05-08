const burgerBtn = document.querySelector('#burger'),
    header = document.querySelector('#header'),
    nuvigationMenu = document.querySelector('.header__nav'),
    overlay = document.querySelector('#overlay'),
    petsGrid = document.querySelector('.pets__grid'),
    pagination = document.querySelector('#pagination'),
    firstPage = document.querySelector('#firstPage'),
    prevPage = document.querySelector('#prevPage'),
    numOfPage = document.querySelector('#numOfPage'),
    nextPage = document.querySelector('#nextPage'),
    lastPage = document.querySelector('#lastPage'),
    modal = document.querySelector('.modal'),
    modalClose = document.querySelector('.modal__close'),
    cards = document.querySelectorAll('.pet__card .btn'),
    petImageUrl = document.querySelector('#photo'),
    petName = document.querySelector('#name'),
    petType = document.querySelector('#type'),
    petDescription = document.querySelector('#description'),
    petAge = document.querySelector('#age'),
    petInoculations = document.querySelector('#inoculations'),
    petDiseases = document.querySelector('#diseases'),
    petParasites = document.querySelector('#parasites');

// Burger menu
const burger = () => {
    burgerBtn.classList.toggle('active');
    nuvigationMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    header.classList.toggle('active');
    if (burgerBtn.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'visible';
    }
}

// Overlay
const overlayOptions = () => {
    overlay.classList.remove('active');
    nuvigationMenu.classList.remove('active');
    burgerBtn.classList.remove('active');
    modal.classList.remove('active');
    header.classList.remove('active');
    if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'visible';
    }
}

const closeModal = () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'visible';
}

// Pets
let pets = [],
    allItems = [], // For all items
    countOfItems = 6 /*Math.ceil(pets.length / numOfItems)*/ , // Arrays to copy
    numOfItems = 8, // Items to show
    pageNum = 1, // Num for screen
    allowChange = false, // For check animation
    itNotFirst = false, // For check if it's not first load
    animationTime = 100; // Time on animation

const adaptation = () => {
    let pointA = false,
        pointB = false,
        pointC = false,
        pointD = false,
        allowToMin = false,
        desctopSize = 1280,
        tabletSize = 768,
        windowWidth = window.innerWidth;

    var desctop = (width) => {
        if (width < desctopSize && !pointA) {
            pointA = true;
            pointB = false;
            numOfItems = 6;
            itNotFirst = false;
            petsGrid.innerHTML = '';
            appendSlides(petsGrid);
            checkPage();
            allowToMin = true;
        }

        if (width >= desctopSize && !pointB) {
            pointB = true;
            pointA = false;
            numOfItems = 8;
            itNotFirst = false;
            petsGrid.innerHTML = '';
            appendSlides(petsGrid);
            checkPage();
            allowToMin = false;
        }
    };
    var tablet = (width) => {
        if (allowToMin) {
            if (width < tabletSize && !pointC) {
                pointC = true;
                pointD = false;
                numOfItems = 3;
                itNotFirst = false;
                petsGrid.innerHTML = '';
                appendSlides(petsGrid);
                checkPage();
            }

            if (width >= tabletSize && !pointD) {
                pointD = true;
                pointC = false;
                numOfItems = 6;
                itNotFirst = false;
                petsGrid.innerHTML = '';
                appendSlides(petsGrid);
                checkPage();
            }
        }
    };
    desctop(windowWidth);
    tablet(windowWidth);
    window.addEventListener('resize', function () {
        windowWidth = window.innerWidth;
        desctop(windowWidth);
        tablet(windowWidth);
    });
}

const getPets = async () => {
    const url = './pets.json';
    const request = await fetch(url);
    const result = await request.json();

    pets = result;

    // Indexing for modals
    pets.forEach((el, i) => el.index = i);

    allItems = mainSort(pets); // Mixing & making main array
    allItems = everySix(allItems); // Sort

    // Init
    adaptation();
}

// Mixing & making main array
const mainSort = (list) => {
    list = list.slice();
    let tempArr = [];

    for (let i = 0; i < countOfItems; i++) {
        const newPets = list;

        for (let j = list.length; j > 0; j--) {
            let randInd = Math.floor(Math.random() * j);
            const randElem = newPets.splice(randInd, 1)[0];
            newPets.push(randElem);
        }

        tempArr = [...tempArr, ...newPets];
    }

    return tempArr;
}

// Sort
const everySix = (list) => {
    const length = list.length;
    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            const dublicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j);
            });

            if (dublicatedItem !== undefined) {
                const ind = (i * 6) + j;
                const which8OfList = Math.trunc(ind / 8);

                list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

                everySix(list);
            }
        }
    }
    return list;
}

// Append items to HTML and animate them
const makingItems = (arr, wrapper) => {
    if (itNotFirst) { // Make sure if it's not first load
        fadeOut('.pet__card');
        setTimeout(function () {
            arr.forEach((el, i) => {
                wrapper.insertAdjacentHTML('beforeend', `
                    <div class="pet__card" data-modal="${el.index}">
                        <div class="pet__card-img">
                            <img src="${el.img}" alt="">
                        </div>
                        <h4 class="pet__card-title">${el.name}</h4>
                        <div class="btn btn-transparent">Learn more</div>
                    </div>
                  `);
            });
            fadeIn('.pet__card');
        }, (animationTime * numOfItems));
    } else { // If it first we don't need fadeOut();
        arr.forEach((el, i) => {
            wrapper.insertAdjacentHTML('beforeend', `
                <div class="pet__card" data-modal="${el.index}">
                    <div class="pet__card-img">
                        <img src="${el.img}" alt="">
                    </div>
                    <h4 class="pet__card-title">${el.name}</h4>
                    <div class="btn btn-transparent">Learn more</div>
                </div>
              `);
        });
        fadeIn('.pet__card');
        itNotFirst = true;
    }
}

const fadeIn = (el) => {
    allowChange = false;
    let cards = document.querySelectorAll(el);
    let count = -1;
    let timer = setInterval(() => {
        count++;
        cards[count].classList.add('fade')
        if (count === cards.length - 1) {
            clearInterval(timer);
            allowChange = true;
        }
    }, animationTime);

    // Add listener for open modal
    const items = document.querySelectorAll('.pet__card');
    items.forEach(el => {
        el.addEventListener('click', function () {
            const currentEl = this.getAttribute('data-modal');
            petImageUrl.setAttribute('src', pets[currentEl].img)
            petName.innerText = pets[currentEl].name;
            petType.innerText = pets[currentEl].type;
            petDescription.innerText = pets[currentEl].description;
            petAge.innerText = pets[currentEl].age;
            petInoculations.innerText = pets[currentEl].inoculations.join(', ');
            petDiseases.innerText = pets[currentEl].diseases.join(', ');
            petParasites.innerText = pets[currentEl].parasites.join(', ');

            overlay.classList.add('active');
            modal.classList.add('active');
            if (overlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'visible';
            }
        });
    });
}

const fadeOut = (el) => {
    allowChange = false;
    let cards = document.querySelectorAll(el);
    let count = -1;
    let timer = setInterval(() => {
        count++;
        cards[count].classList.add('out')
        cards[count].classList.remove('fade')
        if (count === cards.length - 1) {
            clearInterval(timer);
            petsGrid.innerHTML = '';
            allowChange = true;
        }
    }, animationTime);
}

const appendSlides = (wrapper) => {
    const start = (pageNum - 1) * numOfItems;
    const end = start + numOfItems;
    let showItems = allItems.slice(start, end);

    numOfPage.innerText = pageNum;
    makingItems(showItems, wrapper);
}

const checkPage = () => {
    if (pageNum < 0 || pageNum > Math.ceil(allItems.length / numOfItems)) return false;
    if (pageNum == Math.ceil(allItems.length / numOfItems)) {
        nextPage.setAttribute('disabled', '');
        lastPage.setAttribute('disabled', '');
    } else {
        nextPage.removeAttribute('disabled');
        lastPage.removeAttribute('disabled');
    }
    if (pageNum == 1) {
        prevPage.setAttribute('disabled', '');
        firstPage.setAttribute('disabled', '');
    } else {
        prevPage.removeAttribute('disabled');
        firstPage.removeAttribute('disabled');
    }
}

// Run
pagination.addEventListener('click', function (event) {
    const e = window.event || event;
    const target = e.target;
    if (allowChange) {
        switch (target) {
            case nextPage:
                pageNum++;
                checkPage();
                appendSlides(petsGrid);
                break;
            case prevPage:
                pageNum--;
                checkPage();
                appendSlides(petsGrid);
                break;
            case lastPage:
                pageNum = Math.ceil(allItems.length / numOfItems);
                checkPage();
                appendSlides(petsGrid);
                break;
            case firstPage:
                pageNum = 1;
                checkPage();
                appendSlides(petsGrid);
                break;
        }
    }
});

// Disable links
document.querySelectorAll('.nav__link:nth-child(n+3)').forEach(el => {
    el.classList.add('disabled');
    el.addEventListener('click', function (event) {
        event.preventDefault();
    })
})

burgerBtn.addEventListener('click', burger);
overlay.addEventListener('click', overlayOptions);
modalClose.addEventListener('click', closeModal);
getPets();