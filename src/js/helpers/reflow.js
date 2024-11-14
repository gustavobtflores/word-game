export const reflow = (el) => {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
};
