const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("[data-section]");
const reels = document.querySelectorAll("[data-reel]");
const projectButtons = document.querySelectorAll("[data-project-button]");
const projectPanels = document.querySelectorAll("[data-project-panel]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("is-active", active);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0.01
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const setupReel = (reel) => {
  const images = Array.from(reel.querySelectorAll(".anchor-image"));

  if (images.length <= 1 || prefersReducedMotion.matches) {
    return;
  }

  let currentIndex = images.findIndex((image) => image.classList.contains("is-active"));
  if (currentIndex === -1) {
    currentIndex = 0;
    images[0].classList.add("is-active");
  }

  const interval = Number(reel.dataset.interval) || 6200;
  const fadeDuration = 1400;
  let timer = null;
  let isVisible = false;

  images.forEach((image, index) => {
    image.style.zIndex = index === currentIndex ? "2" : "1";
  });

  const showImage = (nextIndex) => {
    if (nextIndex === currentIndex) {
      return;
    }

    const currentImage = images[currentIndex];
    const nextImage = images[nextIndex];

    nextImage.style.zIndex = "2";
    nextImage.classList.add("is-active");

    window.setTimeout(() => {
      currentImage.classList.remove("is-active");
      currentImage.style.zIndex = "1";
      currentIndex = nextIndex;
    }, fadeDuration);
  };

  const start = () => {
    if (timer || !isVisible) {
      return;
    }

    timer = window.setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      showImage(nextIndex);
    }, interval);
  };

  const stop = () => {
    if (!timer) {
      return;
    }

    window.clearInterval(timer);
    timer = null;
  };

  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;

        if (isVisible) {
          start();
        } else {
          stop();
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  reelObserver.observe(reel);
};

reels.forEach(setupReel);

const setActiveProject = (project) => {
  projectPanels.forEach((panel) => {
    const isActive = panel.dataset.projectPanel === project;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  projectButtons.forEach((button) => {
    const isActive = button.dataset.projectButton === project;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
};

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveProject(button.dataset.projectButton);
  });
});

