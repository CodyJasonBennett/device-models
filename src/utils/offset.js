/**
 * Gets the coordinates of an element and applies an offset.
 */
function offset(element, orientation = 'bottom') {
  if (!element) return;

  const rect = element.getBoundingClientRect();

  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const offsetTop = (rect.top + scrollTop) * (orientation === 'bottom' ? 1 : -1);
  const offsetLeft = rect.left + scrollLeft;

  const top = element.clientHeight + offsetTop + 8;
  const left = offsetLeft + element.clientWidth / 2;

  return { top, left };
}

export default offset;
