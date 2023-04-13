const isElementInViewport = (el, topOffset, bottomOffset) => {
  const rect = el.getBoundingClientRect()

  return !(rect.bottom - bottomOffset < 0 || rect.right < 0 ||
        rect.left > window.innerWidth ||
        rect.top + topOffset > window.innerHeight)
}
const isIE11 = function () {
  return !!window.MSInputMethodContext && !!document.documentMode
}

const sleep = function (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports = {
  isElementInViewport,
  isIE11,
  sleep
}
