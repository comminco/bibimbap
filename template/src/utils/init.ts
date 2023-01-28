/**
 * once execute
 */
export function init() {
  easterEgg()
  opening()
}

/**
 * after rendering, remove intro and appear components
 */
const opening = () => {
  setTimeout(() => {
    const introEl = document.getElementById('intro')!
    const bibimbapEl = document.getElementById('_bibimbap')!

    bibimbapEl.style.animation = 'appear linear 1.5s 1 Forwards'
    introEl.style.animation = 'disappear linear 1s 1 Forwards'

    setTimeout(() => {
      introEl.remove()
    }, 1200)
  }, 2200)
}

const easterEgg = () => {
  console.log(
    '%c by commin - https://commin.co',
    'color: #4A6F84; font-size: 12px; font-weight:bold; a { color: #fff;}'
  )
}
