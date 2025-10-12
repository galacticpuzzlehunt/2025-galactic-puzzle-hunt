window.addEventListener("load", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const menuBtnSpan = document.querySelector("#menu-btn span");
  const slideNav = document.querySelector("#slide-nav");
  const toggleAnimTime = 300; // 0.3s, to match the CSS value
  // Time to wait before closing the nav if unhovering.
  const closeDebounceTime = 300;
  let isActive = false;
  let shouldBeActive = false;
  let toggleTimeout;
  let lastToggleTime = 0;
  let openedViaHover = false;

  const openNav = () => {
    isActive = true;
    menuBtn.setAttribute("aria-label", "Close navigation");
    menuBtn.setAttribute("aria-expanded", "true");
    slideNav.classList.remove("close");
    slideNav.classList.add("open");
  };

  const closeNav = () => {
    isActive = false;
    menuBtn.setAttribute("aria-label", "Open navigation");
    menuBtn.setAttribute("aria-expanded", "false");
    slideNav.classList.remove("open");
    slideNav.classList.add("close");
  };

  const triggerToggle = (newShouldBeActive, isHoverActivated = false) => {
    openedViaHover = newShouldBeActive && isHoverActivated;
    shouldBeActive = newShouldBeActive;
    const waitTime = Math.max(...[
      // this addresses an ios safari race condition where we get a mouseenter
      // and then immediately a click. why are we doing this
      10,
      lastToggleTime + toggleAnimTime - Date.now(), // animation time
      isHoverActivated && !newShouldBeActive ? closeDebounceTime : 0
    ]);
    clearTimeout(toggleTimeout);
    toggleTimeout = setTimeout(() => {
      if (isActive === shouldBeActive) return;
      lastToggleTime = Date.now();
      if (shouldBeActive) openNav();
      else closeNav();
      clearTimeout(toggleTimeout);
    }, waitTime);
  };

  menuBtn.addEventListener("click", (e) => {
    triggerToggle(!isActive);
    e.stopPropagation();
  });

  // if we click a link, close the nav
  slideNav.addEventListener("click", (e) => {
    // do not close if someone is opening new tabs
    if (!e.ctrlKey && !e.shiftKey && e.target.closest("a")) {
      triggerToggle(false);
    }
  });

  slideNav.addEventListener("mouseenter", () => {
    triggerToggle(true, true);
  });

  slideNav.addEventListener("mouseleave", () => {
    if (openedViaHover) {
      triggerToggle(false, true);
    }
  });
});
