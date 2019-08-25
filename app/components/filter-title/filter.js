const filterTrigger = document.querySelectorAll('.js-filter-trigger');
const filterCat = document.querySelector('.filterCat');
const classes = {
  isActive: 'is-active'
}
const toggleClass = (el, className) => {
  if (el.classList.contains(className)) {
    el.classList.remove(classes.isActive);
  } else {
    el.classList.add(className);
  }
}

for (let elem of filterTrigger) {
    elem.addEventListener('click', (e) => {
      toggleClass(e.currentTarget, classes.isActive)
    })
  }
