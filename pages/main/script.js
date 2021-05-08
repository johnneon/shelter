// Get all elements
const burgerBtn = document.querySelector('#burger');
nuvigationMenu = document.querySelector('.header__nav'),
  overlay = document.querySelector('#overlay'),
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
  petParasites = document.querySelector('#parasites'),
  slider = document.querySelector('.pets__slider'),
  btnNext = document.querySelector('#arrow-right'),
  btnPrev = document.querySelector('#arrow-left');

// Burger menu
burgerBtn.addEventListener('click', function () {
  this.classList.toggle('active');
  nuvigationMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  if (this.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'visible';
  }
});

const overlayOptions = () => {
  overlay.classList.remove('active');
  nuvigationMenu.classList.remove('active');
  burgerBtn.classList.remove('active');
  modal.classList.remove('active');
  if (overlay.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'visible';
  }
}

// Disable links
document.querySelectorAll('.nav__link:nth-child(n+3)').forEach(el => {
  el.classList.add('disabled');
  el.addEventListener('click', function (event) {
    event.preventDefault();
  })
})

modalClose.addEventListener('click', function (e) {
  e.preventDefault();
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = 'visible';
});

// Slider
let pets = [],
  itemsToShow = 3,
  check = 2,
  current = 0,
  toRight = true,
  toLeft = true,
  allowToSlide = true;

// Get pets.json
const getPets = async () => {
  const url = './pets.json';
  const request = await fetch(url);
  const result = await request.json();

  pets = result;

  // Indexing for modals
  pets.forEach((el, i) => el.index = i);

  // Init
  adaptation();
}


const appendSlides = (sliderWrapper) => {
  sliderWrapper.innerHTML = '';
  const list = mainSort(pets);
  list.forEach((el, i, list) => {
    sliderWrapper.insertAdjacentHTML('beforeend', `
      <div data-modal="${el.index}" class="pet__card">
          <div class="pet__card-img">
              <img src="${el.img}" alt="">
          </div>
          <h4 class="pet__card-title">${el.name}</h4>
          <div class="btn btn-transparent">Learn more</div>
      </div>
    `);
  });

  const items = document.querySelectorAll('.pet__card');
  [...items].forEach(el => {
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

// Mixing & making main array
const mainSort = (list) => {
  return [...list].sort(() => Math.random() - 0.5);
}

const fadeIn = (el) => {
  let cards = [...document.querySelectorAll(el)];
  let count = -1;
  let timer = setInterval(() => {
    count++;
    cards[count].classList.add('fade');
    if (count === cards.length - 1) {
      clearInterval(timer);
    }
  }, 100);
  cards.forEach(el => {
    el.classList.remove('out')
  })
}

const fadeOut = (el) => {
  let cards = [...document.querySelectorAll(el)];
  cards.forEach(el => {
    el.classList.remove('fade')
    el.classList.remove('out')
  })
  let count = -1;
  let timer = setInterval(() => {
    count++;
    cards[count].classList.add('out');
    if (count === cards.length - 1) {
      clearInterval(timer);
    }
  }, 100);
}

const next = () => {
  if (allowToSlide) {
    allowToSlide = false;
    fadeOut('.pet__card.active');
    setTimeout(() => {
      const items = [...slider.children];
      items.forEach(el => el.classList.remove('active'));
      toLeft = true;
      if (toRight) {
        current += check;
        if (current >= items.length) current = 0;
        toRight = false;
      }

      for (let i = 0; i < itemsToShow; i++) {
        current++;
        if (current >= items.length) current = 0;
        items[current].classList.add('active');
      }
      fadeIn('.pet__card.active');
      allowToSlide = true;
    }, 100 * itemsToShow * 2);
  }
}

const prev = () => {
  if (allowToSlide) {
    allowToSlide = false;
    fadeOut('.pet__card.active');
    setTimeout(() => {
      toRight = true;
      if (toLeft) {
        if (current < 0) current = items.length - 1;
        current -= check;
        toLeft = false;
      }
      const items = [...slider.children];
      items.forEach(el => el.classList.remove('active'));
      for (let i = 0; i < itemsToShow; i++) {
        current--;
        if (current < 0) current = items.length - 1;
        items[current].classList.add('active');
      }
      fadeIn('.pet__card.active');
      allowToSlide = true;
    }, 100 * itemsToShow * 2);
  }
}

const swipedetect = (el) => {

  let surface = el;
  let startX = 0;
  let startY = 0;
  let distX = 0;
  let distY = 0;
  let startTime = 0;
  let elapsedTime = 0;

  let threshold = 150;
  let restraint = 100;
  let allowedTime = 300;

  surface.addEventListener('mousedown', function (e) {
    startX = e.pageX;
    startY = e.pageY;
    startTime = new Date().getTime();
    e.preventDefault();
  }, false);

  surface.addEventListener('mouseup', function (e) {
    distX = e.pageX - startX;
    distY = e.pageY - startY;
    elapsedTime = new Date().getTime() - startTime;
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if ((distX > 0)) {
          prev();
        } else {
          next();
        }
      }
    }
    e.preventDefault();
  }, false);

  surface.addEventListener('touchstart', function (e) {
    var touchobj = e.changedTouches[0];
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime();
    e.preventDefault();
  }, false);

  surface.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, false);

  surface.addEventListener('touchend', function (e) {
    var touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX;
    distY = touchobj.pageY - startY;
    elapsedTime = new Date().getTime() - startTime;
    if(elapsedTime < 120) {
      e.target.click();
    }
    if (elapsedTime <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX > 0) {
          prev();
        } else {
          next();
        }
      }
    }
    e.preventDefault();
  }, false);
}

const adaptation = () => {
  let pointA = false,
    pointB = false,
    pointC = false,
    pointD = false,
    allowToMin = true,
    allowToMax = true,
    desctopSize = 1280,
    tabletSize = 768,
    windowWidth = window.innerWidth;

  var desctop = (width) => {
    if (allowToMax) {
      if (width < desctopSize && !pointA) {
        pointA = true;
        pointB = false;
        allowToMax = false;
        allowToMin = true;
        itemsToShow = 2;
        check = 1;
        appendSlides(slider);
        swipedetect(slider);
      }

      if (width >= desctopSize && !pointB) {
        pointB = true;
        pointA = false;
        allowToMin = false;
        itemsToShow = 3;
        check = 2;
        appendSlides(slider);
        swipedetect(slider);
      }
    }
  };
  var tablet = (width) => {
    if (allowToMin) {
      if (width < tabletSize && !pointC) {
        pointC = true;
        pointD = false;
        allowToMax = false;
        itemsToShow = 1;
        check = 0;
        appendSlides(slider);
        swipedetect(slider);
      }

      if (width >= tabletSize && !pointD) {
        pointD = true;
        pointC = false;
        allowToMax = true;
        allowToMin = false;
        itemsToShow = 2;
        check = 1;
        appendSlides(slider);
        swipedetect(slider);
      }
    }
  };
  desctop(windowWidth);
  tablet(windowWidth);
  const items = slider.children;
  for (let i = 0; i < itemsToShow; i++) {
    items[i].classList.add('active');
  }
  fadeIn('.pet__card.active');
  window.addEventListener('resize', function () {
    windowWidth = window.innerWidth;
    desctop(windowWidth);
    tablet(windowWidth);
    const items = slider.children;
    for (let i = 0; i < itemsToShow; i++) {
      items[i].classList.add('active');
    }
    fadeIn('.pet__card.active');
  });

}

// Run
getPets();
btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);
overlay.addEventListener('click', overlayOptions);