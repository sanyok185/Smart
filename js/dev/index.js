import "./common.min.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function updateAboutCards() {
  document.querySelectorAll(".item-about").forEach((card) => {
    const image = card.querySelector(".item-about__image");
    const content = card.querySelector(".item-about__content");
    const text = card.querySelector(".item-about__text");
    if (!image || !content || !text) return;
    const prevMaxHeight = text.style.maxHeight;
    const prevOpacity = text.style.opacity;
    text.style.maxHeight = "none";
    text.style.opacity = "1";
    const fullTextHeight = text.scrollHeight;
    text.style.maxHeight = prevMaxHeight;
    text.style.opacity = prevOpacity;
    const textPaddingTop = parseFloat(getComputedStyle(text).paddingTop) || 0;
    const closedContentHeight = content.offsetHeight - textPaddingTop;
    card.style.setProperty("--opened-text-height", `${fullTextHeight}px`);
    card.style.setProperty("--content-closed-height", `${closedContentHeight}px`);
  });
}
window.addEventListener("load", updateAboutCards);
window.addEventListener("resize", updateAboutCards);
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (isTouch) {
  document.documentElement.classList.add("touch");
  const cards = document.querySelectorAll(".item-about");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      const isOpen = card.classList.contains("is-open");
      cards.forEach((c) => c.classList.remove("is-open"));
      if (!isOpen) {
        card.classList.add("is-open");
      }
    });
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".item-about")) {
      cards.forEach((c) => c.classList.remove("is-open"));
    }
  });
}
