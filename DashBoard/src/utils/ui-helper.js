export function makeDragAndDroppable (element, onDrop, overlayDiv) {
  const dragEnter = function (e) {
    overlayDiv.style.visibility = 'visible'
    overlayDiv.style.opacity = 1
  }

  const dragLeave = function (e) {
    e.preventDefault()
    if (overlayDiv) {
      overlayDiv.style.visibility = 'hidden'
      overlayDiv.style.opacity = 0
    }
  }

  const dragOver = function (e) {
    e.preventDefault()
    if (overlayDiv) {
      overlayDiv.style.visibility = 'visible'
      overlayDiv.style.opacity = 1
    }
  }

  const drop = function (e) {
    e.preventDefault()
    if (overlayDiv) {
      overlayDiv.style.visibility = 'hidden'
      overlayDiv.style.opacity = 0
    }
    if (onDrop) {
      onDrop(e)
    }
  }

  // Remove current listeners if any.
  element.ondragenter = null
  element.ondragleave = null
  element.ondragover = null
  element.ondrop = null

  element.addEventListener('dragenter', dragEnter)
  element.addEventListener('dragleave', dragLeave)
  element.addEventListener('dragover', dragOver)
  element.addEventListener('drop', drop)
}

export async function confirm ({ okBtnText, notOkBtntext }) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-unused-expressions
    [
      [
        `<button>${okBtnText}</button>`,
        resolve,
        true
      ],
      [
        `<button>${notOkBtntext}</button>`,
        reject
      ]
    ]
  })
}
