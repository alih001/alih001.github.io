const navLogo = document.querySelector('navbar__logo')
// Show active menu when scrolling
const HighlightMenu = () => {
  const elem = document.querySelector('.highlight')
  const guideMenu = document.querySelector('#guide-page')
  const tableMenu = document.querySelector('#table-link-page')
  const factorsMenu = document.querySelector('#factors-page')
  const rankingMenu = document.querySelector('#top10-page')
  let scrollPos = window.scrollY

  // Adds highlight class to menu items
  if (scrollPos < 600) {
    guideMenu.classList.add('highlight')
    tableMenu.classList.remove('highlight')
    factorsMenu.classList.remove('highlight')
    return
  } else if (scrollPos < 1400) {
    tableMenu.classList.add('highlight')
    guideMenu.classList.remove('highlight')
    factorsMenu.classList.remove('highlight')
    return
    // } else if (scrollPos < 2345) {
    //     servicesMenu.classList.add('highlight')
    //     aboutMenu.classList.remove('highlight')
    //     return
  }
  if ((elem && scrollPos < 600) || elem) {
    elem.classList.remove('highlight')
  }
}

window.addEventListener('scroll', HighlightMenu)
window.addEventListener('click', HighlightMenu)
