gsap.set('.page-wrapper', { opacity: 1 });

gsap.registerPlugin(ScrollTrigger);

const marqueeIx = () => {
  const tl = gsap.timeline({ repeat: -1 });

  tl.to('[marquee-track]', { x: '-100%', ease: 'none', duration: 66 });
};
marqueeIx();

function heroReveal() {
  const hero = document.querySelector('[hero-wrap]');
  const navbar = document.querySelector('[navbar-component]');

  if (!hero) return;

  const tag = hero.querySelector('[hero-tag]');
  const heading = hero.querySelector('[hero-heading]');
  const banner = hero.querySelector('[hero-banner]');
  const buttons = hero.querySelectorAll('[hero-btn]');
  const image = hero.querySelector('[hero-img]');

  const tl = gsap.timeline({
    defaults: {
      ease: 'power2.out',
    },
  });

  if (navbar) {
    tl.from(navbar, {
      y: '-1.5rem',
      opacity: 0,
      duration: 0.6,
    });
  }

  if (tag) {
    tl.from(
      tag,
      {
        y: '1rem',
        opacity: 0,
        duration: 0.55,
      },
      '-=0.5',
    );
  }

  if (heading) {
    tl.from(
      heading,
      {
        y: '2rem',
        opacity: 0,
        duration: 0.75,
      },
      '-=0.4',
    );
  }

  if (banner) {
    tl.from(
      banner,
      {
        y: '1rem',
        opacity: 0,
        duration: 0.6,
      },
      '-=0.6',
    );
  }

  if (buttons.length) {
    tl.from(
      buttons,
      {
        y: '1rem',
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      },
      '-=0.44',
    );
  }

  if (image) {
    tl.from(
      image,
      {
        y: '2.5rem',
        scale: 0.97,
        opacity: 0,
        duration: 1,
      },
      '-=0.6',
    );
  }
}

heroReveal();

const platformRevealTimelines = new WeakMap();

function platformReveal() {
  const sections = gsap.utils.toArray("[platform-wrap]");

  if (!sections.length) return;

  const DIRECTIONS = [
    { x: -60, y: -50 },
    { x: 60, y: -50 },
    { x: -70, y: 10 },
    { x: 60, y: 50 },
    { x: -30, y: 50 }
  ];

  sections.forEach((section) => {
    const heading = section.querySelector("[platform-heading]");
    const para = section.querySelector("[platform-para]");
    const items = gsap.utils.toArray(
      section.querySelectorAll("[platform-item]")
    );

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out"
      },
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        toggleActions: "play none none reverse"
      }
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.9
      });
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.75
        },
        "-=0.68"
      );
    }

    items.forEach((item, index) => {
      const direction = DIRECTIONS[index % DIRECTIONS.length];

      tl.from(
        item,
        {
          autoAlpha: 0,
          x: direction.x,
          y: direction.y,
          scale: 0.85,
          duration: 1.2
        },
        index === 0 ? "-=0.55" : "<+=0.09"
      );
    });

    platformRevealTimelines.set(section, tl);
  });
}

function platformScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray("[platform-section]");

  if (!sections.length) return;

  const ORBIT_SHARE = 0.64;
  const ROTATIONS = 0.6;
  const STACK_OFFSET = 10;
  const STACK_ROTATION = 6;
  const SMOOTH_DURATION = 0.55;

  sections.forEach((section) => {
    const wrap = section.querySelector("[platform-wrap]");
    const content = section.querySelector("[platform-content]");
    const items = gsap.utils.toArray(
      section.querySelectorAll("[platform-item]")
    );

    if (!wrap || !content || !items.length) return;

    const revealTimeline = platformRevealTimelines.get(wrap);

    items.forEach((item, index) => {
      gsap.set(item, {
        zIndex: index + 1
      });

      item.style.willChange = "transform, opacity";
    });

    let contentCenter = { x: 0, y: 0 };
    let restCenters = [];
    let startAngles = [];
    let startRadii = [];
    let orbitRadius = 0;
    let bottomTargets = [];
    let orbitActive = false;

    const state = {
      progress: 0
    };

    function measure() {

      const savedTransforms = items.map((item) => ({
        x: gsap.getProperty(item, "x"),
        y: gsap.getProperty(item, "y"),
        rotation: gsap.getProperty(item, "rotation"),
        scaleX: gsap.getProperty(item, "scaleX"),
        scaleY: gsap.getProperty(item, "scaleY")
      }));

      gsap.set(items, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1
      });

      const wrapRect = wrap.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      contentCenter = {
        x: contentRect.left + contentRect.width / 2 - wrapRect.left,
        y: contentRect.top + contentRect.height / 2 - wrapRect.top
      };

      restCenters = items.map((item) => {
        const rect = item.getBoundingClientRect();

        return {
          x: rect.left + rect.width / 2 - wrapRect.left,
          y: rect.top + rect.height / 2 - wrapRect.top
        };
      });

      startAngles = restCenters.map((center) =>
        Math.atan2(
          center.y - contentCenter.y,
          center.x - contentCenter.x
        )
      );

      startRadii = restCenters.map((center) =>
        Math.hypot(
          center.x - contentCenter.x,
          center.y - contentCenter.y
        )
      );

      orbitRadius = Math.min(...startRadii);

      const bottomY = contentCenter.y + wrapRect.height * 0.34;

      bottomTargets = items.map((item, index) => {
        const centered = index - (items.length - 1) / 2;

        return {
          x: contentCenter.x + centered * STACK_OFFSET,
          y: bottomY,
          rotation: centered * STACK_ROTATION
        };
      });

      items.forEach((item, index) => {
        gsap.set(item, savedTransforms[index]);
      });
    }

    function render() {
      const progress = state.progress;

      const orbitT = gsap.utils.clamp(
        0,
        1,
        progress / ORBIT_SHARE
      );

      const convergeT = gsap.utils.clamp(
        0,
        1,
        (progress - ORBIT_SHARE) / (1 - ORBIT_SHARE)
      );

      items.forEach((item, index) => {
        const angle =
          startAngles[index] +
          orbitT * Math.PI * 2 * ROTATIONS;

        const radius = gsap.utils.interpolate(
          startRadii[index],
          orbitRadius,
          orbitT
        );

        const orbitPosition = {
          x: contentCenter.x + Math.cos(angle) * radius,
          y: contentCenter.y + Math.sin(angle) * radius
        };

        const finalPosition = {
          x: gsap.utils.interpolate(
            orbitPosition.x,
            bottomTargets[index].x,
            convergeT
          ),
          y: gsap.utils.interpolate(
            orbitPosition.y,
            bottomTargets[index].y,
            convergeT
          )
        };

        gsap.set(item, {
          x: finalPosition.x - restCenters[index].x,
          y: finalPosition.y - restCenters[index].y,
          rotation: gsap.utils.interpolate(
            0,
            bottomTargets[index].rotation,
            convergeT
          ),
          scale: gsap.utils.interpolate(1, 0.55, convergeT)
        });
      });
    }

    function setOrbitProgress(progress, immediate = false) {
      if (!orbitActive) return;

      if (immediate) {
        gsap.killTweensOf(state);

        state.progress = progress;
        render();

        return;
      }

      gsap.to(state, {
        progress,
        duration: SMOOTH_DURATION,
        ease: "power3.out",
        overwrite: true,
        onUpdate: render
      });
    }

    function enableOrbit(self, immediate = false) {
      if (!orbitActive) {

        if (
          revealTimeline &&
          revealTimeline.progress() < 1
        ) {
          revealTimeline.progress(1);
        }

        orbitActive = true;
      }

      setOrbitProgress(self.progress, immediate);
    }

    measure();

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom center",
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onEnter: (self) => {
        enableOrbit(self, true);
      },

      onEnterBack: (self) => {
        enableOrbit(self, true);
      },

      onUpdate: (self) => {
        if (!orbitActive) {
          enableOrbit(self);
        } else {
          setOrbitProgress(self.progress);
        }
      },

      onLeaveBack: () => {
        gsap.killTweensOf(state);

        state.progress = 0;
        orbitActive = false;

        render();
      },

      onRefresh: (self) => {
        measure();

        if (self.isActive || self.progress === 1) {
          enableOrbit(self, true);
        }
      }
    });

    const images = items
      .map((item) => item.querySelector("img"))
      .filter(Boolean);

    const unloadedImages = images.filter(
      (image) => !image.complete
    );

    unloadedImages.forEach((image) => {
      image.addEventListener(
        "load",
        () => ScrollTrigger.refresh(), { once: true }
      );
    });
  });
}

platformReveal();
platformScroll();

function collectReveal() {
  const sections = gsap.utils.toArray('[collect-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[collect-heading]');
    const items = gsap.utils.toArray(section.querySelectorAll('[collect-link]'));
    const images = items
      .map((item) => item.querySelector('.collect_img_wrap img'))
      .filter(Boolean);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 74%',
      },
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
      });
    }

    if (items.length) {
      tl.from(
        items,
        {
          autoAlpha: 0,
          duration: 0.9,
          stagger: {
            each: 0.12,
          },
        },
        '-=0.55'
      );
    }

    if (images.length) {
      tl.from(
        images,
        {
          scale: 1.02,
          duration: 1.2,
          stagger: {
            each: 0.12,
          },
        },
        '-=1.1'
      );
    }
  });
}

collectReveal();

function goGlobalReveal() {
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray("[go-global-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector("[go-global-heading]");

    const blocks = gsap.utils.toArray(
      section.querySelectorAll("[go-global-item]")
    );

    const images = gsap.utils.toArray(
      section.querySelectorAll("[go-global-img] img")
    );

    const contentItems = gsap.utils.toArray(
      section.querySelectorAll("[go-global-title], [go-global-para]")
    );

    const revealTl = gsap.timeline({
      defaults: {
        ease: "power2.out",
      },
      scrollTrigger: {
        trigger: section,
        start: "top 64%",
      },
    });

    if (heading) {
      revealTl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
      });
    }

    if (blocks.length) {
      revealTl.from(
        blocks,
        {
          autoAlpha: 0,
          y: 44,
          scale: 0.985,
          duration: 0.9,
          stagger: {
            each: 0.14,
          },
        },
        heading ? "-=0.68" : 0
      );
    }

    if (images.length) {
      revealTl.from(
        images,
        {
          scale: 1.04,
          duration: 1.2,
          stagger: {
            each: 0.14,
          },
        },
        "-=0.78"
      );
    }

    if (contentItems.length) {
      revealTl.from(
        contentItems,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.65,
          stagger: 0.08,
        },
        "-=0.72"
      );
    }
  });
}

goGlobalReveal();

function goGlobalBottomScrub() {
  gsap.registerPlugin(ScrollTrigger);

  const sections = gsap.utils.toArray('[go-global-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const bottom = section.querySelector('.go-global_bottom');
    const logo = section.querySelector('[go-global-logo]');
    const divider = section.querySelector('[go-global-divider]');
    const dot = section.querySelector('[go-global-divider-dot]');
    const circle = section.querySelector('[go-global-circle]');
    const circleFill = circle?.querySelector('.go-global_bottom_circle_fill');

    if (!bottom || !divider) return;

    gsap.set(divider, { scaleY: 0, transformOrigin: 'top center' });
    if (dot) gsap.set(dot, { autoAlpha: 0, scale: 0.4 });
    if (logo) gsap.set(logo, { autoAlpha: 0, scale: 0.8 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: bottom,
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: 1.4,
      },
    });

    if (logo) {
      tl.to(logo, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0);
    }

    tl.to(divider, { scaleY: 1, duration: 0.6, ease: 'none' }, 0.1);

    if (dot) {
      tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 0.62);
    }
  });
}

goGlobalBottomScrub();

function stackReveal() {
  const sections = gsap.utils.toArray('[stack-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[stack-heading]');
    const sliderParent = section.querySelector('.stack_slider_parent');
    const background = section.querySelector('[stack-img]');
    const sliderBottom = section.querySelector('.stack_slider_bottom');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
      },
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
      });
    }

    if (sliderParent) {
      tl.from(
        sliderParent,
        {
          autoAlpha: 0,
          y: 44,
          duration: 1,
        },
        '-=0.68'
      );
    }

    if (sliderBottom) {
      tl.from(
        sliderBottom,
        {
          autoAlpha: 0,
          y: 18,
          duration: 0.65,
        },
        '-=0.5'
      );
    }
  });
}

stackReveal();

function aiReveal() {
  const sections = gsap.utils.toArray('[ai-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[ai-heading]');
    const para = section.querySelector('[ai-para]');
    const clouds = gsap.utils.toArray(section.querySelectorAll('[ai-cloud]'));

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%'
      },
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
      });
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
        },
        '-=0.48'
      );
    }

    if (clouds.length) {
      tl.from(
        clouds,
        {
          autoAlpha: 0,
          y: 24,
          scale: 0.94,
          duration: 1.1,
          stagger: 0.15,
        },
        '-=0.5'
      );

      tl.addLabel('cloudsIn');

      clouds.forEach((cloud, i) => {
        tl.to(
          cloud,
          {
            y: '+=14',
            x: i % 2 === 0 ? '+=42' : '-=42',
            duration: 5 + i * 0.7,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          },
          'cloudsIn'
        );
      });
    }
  });
}

aiReveal();

function disburseReveal() {
  const sections = gsap.utils.toArray('[dis-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[dis-heading]');
    const list = section.querySelector('[dis-list]');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 74%',
      },
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
      });
    }

    if (list) {
      tl.from(
        list,
        {
          autoAlpha: 0,
          y: 36,
          scale: 0.97,
          duration: 1,
        },
        '-=0.68'
      );
    }
  });
}

disburseReveal();

function initDisburseCards() {
  const section = document.querySelector(".section_disburse");
  const track = section?.querySelector(".disburse_track");
  const list = track?.querySelector("[dis-list]");
  const cards = gsap.utils.toArray(track?.querySelectorAll("[dis-item]"));

  if (!section || !track || !list || cards.length < 2) {
    return () => {};
  }

  const totalCards = cards.length;
  const transitionCount = totalCards - 1;
  const segmentSize = 1 / transitionCount;

  const stackOffset = 5;
  const scaleStep = 0.075;
  const exitY = -205;
  const exitRotation = 15;
  const smoothing = window.innerWidth < 991 ? 0.28 : 0.2;

  let targetProgress = 0;
  let renderedProgress = 0;
  let rafId = null;
  let lastLayerState = "";

  gsap.set(cards, {
    xPercent: -50,
    transformStyle: "preserve-3d",
    backfaceVisibility: "hidden"
  });

  function updateLayers(activeIndex, isHandingOff) {
    const state = `${activeIndex}-${isHandingOff}`;

    if (state === lastLayerState) return;
    lastLayerState = state;

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      const isNext = index === activeIndex + 1;

      gsap.set(card, {
        zIndex: index < activeIndex ?
          0 : isActive ?
          totalCards + 1 : totalCards - (index - activeIndex),

        pointerEvents: isActive && !isHandingOff ?
          "auto" : isNext && isHandingOff ?
          "auto" : "none"
      });
    });
  }

  function render(progress) {
    const safeProgress = gsap.utils.clamp(0, 1, progress);

    const activeIndex = Math.min(
      Math.floor(safeProgress / segmentSize),
      transitionCount - 1
    );

    const segmentProgress = gsap.utils.clamp(
      0,
      1,
      (safeProgress - activeIndex * segmentSize) / segmentSize
    );

    const isHandingOff = segmentProgress >= 0.5;

    updateLayers(activeIndex, isHandingOff);

    cards.forEach((card, index) => {
      if (index < activeIndex) {
        gsap.set(card, {
          yPercent: exitY,
          rotationX: exitRotation,
          scale: 1
        });

        return;
      }

      if (index === activeIndex) {
        gsap.set(card, {
          yPercent: gsap.utils.interpolate(-50, exitY, segmentProgress),
          rotationX: gsap.utils.interpolate(0, exitRotation, segmentProgress),
          scale: 1
        });

        return;
      }

      const distanceFromActive = index - activeIndex - segmentProgress;

      gsap.set(card, {
        yPercent: -50 + distanceFromActive * stackOffset,
        rotationX: 0,
        scale: 1 - distanceFromActive * scaleStep
      });
    });
  }

  function tick() {
    rafId = null;

    const difference = targetProgress - renderedProgress;

    if (Math.abs(difference) < 0.0005) {
      renderedProgress = targetProgress;
    } else {
      renderedProgress += difference * smoothing;
    }

    render(renderedProgress);

    if (renderedProgress !== targetProgress) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function setProgress(progress) {
    targetProgress = gsap.utils.clamp(0, 1, progress);

    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  const trigger = ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    invalidateOnRefresh: true,

    onUpdate: (self) => {
      setProgress(self.progress);
    },

    onRefresh: (self) => {
      targetProgress = self.progress;
      renderedProgress = self.progress;
      render(renderedProgress);
    }
  });

  targetProgress = trigger.progress;
  renderedProgress = trigger.progress;
  render(renderedProgress);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    trigger.kill();
  };
}

window.destroyDisburseCards?.();
window.destroyDisburseCards = initDisburseCards();

function inSolutionsReveal() {
  const sections = gsap.utils.toArray('[in-solutions-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[in-solutions-tag]');
    const heading = section.querySelector('[in-solutions-heading]');
    const para = section.querySelector('[in-solutions-para]');
    const tabMenu = section.querySelector('[tab-menu]');
    const tabLinks = tabMenu ? gsap.utils.toArray(tabMenu.querySelectorAll('[tab-link]')) :
      [];
    const tabContent = section.querySelector('[tab-content]');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%'
      },
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        tag ? '-=0.45' : 0
      );
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
        },
        '-=0.65'
      );
    }

    if (tabMenu) {
      tl.from(
        tabMenu,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.74'
      );
    }

    if (tabLinks.length) {
      tl.from(
        tabLinks,
        {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.06,
        },
        '<+=0.1'
      );
    }

    if (tabContent) {
      tl.from(
        tabContent,
        {
          autoAlpha: 0,
          y: 38,
          scale: 0.985,
          duration: 0.95,
        },
        '-=0.88'
      );
    }
  });
}

inSolutionsReveal();

/* Tabs change */
function initTabAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[tab-section]').forEach((section) => {
    const tabComponent = section.querySelector('[tab-component]');
    if (!tabComponent) return;

    const tabLinks = Array.from(tabComponent.querySelectorAll('[tab-menu] [tab-link]'));
    const tabPanes = Array.from(tabComponent.querySelectorAll('[tab-content] [tab-pane]'));

    let activeIndex = 0;
    let autoTimer;
    const duration = 18000;

    // Initial state
    tabLinks.forEach((link, i) => {
      link.classList.toggle('is-active', i === activeIndex);
      tabPanes[i]?.classList.toggle('is-active', i === activeIndex);

      const progress = link.querySelector('[tab-progress]');
      if (progress) {
        progress.style.transformOrigin = 'left center';
        progress.style.transform = 'scaleX(0)';
        progress.style.transition = 'none';
      }
    });

    function startProgress() {
      clearTimeout(autoTimer);

      // Reset all progress bars
      tabLinks.forEach((link) => {
        const progress = link.querySelector('[tab-progress]');
        if (!progress) return;

        progress.style.transition = 'none';
        progress.style.transform = 'scaleX(0)';
      });

      const progress = tabLinks[activeIndex].querySelector('[tab-progress]');

      if (progress) {
        // Force browser reflow
        progress.offsetWidth;

        progress.style.transition = `transform ${duration}ms linear`;
        progress.style.transform = 'scaleX(1)';
      }

      autoTimer = setTimeout(() => {
        activateTab((activeIndex + 1) % tabLinks.length);
      }, duration);
    }

    function pauseProgress() {
      clearTimeout(autoTimer);
    }

    function activateTab(index) {
      if (index === activeIndex) return;

      tabLinks[activeIndex].classList.remove('is-active');
      tabPanes[activeIndex]?.classList.remove('is-active');

      activeIndex = index;

      tabLinks[activeIndex].classList.add('is-active');
      tabPanes[activeIndex]?.classList.add('is-active');

      const wrapper = tabComponent.querySelector('[tab-menu]');

      requestAnimationFrame(() => {
        wrapper.scrollTo({
          left: tabLinks[activeIndex].offsetLeft - (wrapper.clientWidth - tabLinks[
            activeIndex].clientWidth) / 2,
          behavior: 'smooth',
        });
      });

      startProgress();
    }

    tabLinks.forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        activateTab(idx);
      });
    });

    ScrollTrigger.create({
      trigger: tabComponent,
      start: 'top 85%',
      end: 'bottom top',
      onEnter: startProgress,
      onEnterBack: startProgress,
      onLeave: pauseProgress,
      onLeaveBack: pauseProgress,
    });
  });
}

initTabAnimation();

function buildAiTrackTabs() {
  gsap.registerPlugin(ScrollTrigger);

  const tracks = gsap.utils.toArray('[ai-track]');
  if (!tracks.length) return;

  tracks.forEach((track) => {
    const panes = gsap.utils.toArray(track.querySelectorAll('[ai-tab-pane]'));
    const tabBtns = gsap.utils.toArray(track.querySelectorAll('[ai-tab-btn]'));
    const fills = tabBtns.map((btn) => btn.querySelector('[ai-tab-progress]'));

    const count = Math.min(panes.length, tabBtns.length);
    if (!count) return;

    gsap.set(fills, { width: '0%' });

    function setActive(index) {
      panes.forEach((pane, i) => pane.classList.toggle('is-active', i === index));
      tabBtns.forEach((btn, i) => btn.classList.toggle('is-active', i === index));
    }

    function updateProgress(progress) {
      const scaledProgress = progress * count;
      const activeIndex = Math.min(count - 1, Math.floor(scaledProgress));

      setActive(activeIndex);

      fills.forEach((fill, i) => {
        const width = i === activeIndex ? (scaledProgress - activeIndex) * 100 : 0;
        gsap.set(fill, { width: `${width}%` });
      });
    }

    ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => updateProgress(self.progress),
    });
  });
}

if (window.innerWidth > 991) {
  buildAiTrackTabs();
}

function testimonials2Reveal() {
  const sections = gsap.utils.toArray('[testimonials-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[testimonials-tag]');
    const heading = section.querySelector('[testimonials-heading]');
    const button = section.querySelector('[testimonials-btn]');
    const component = section.querySelector('.testimonials2_component');
    const slides = gsap.utils.toArray(section.querySelectorAll('.testimonials2_link'));
    const sliderBottom = section.querySelector('.slider_bottom_wrap');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 66%'
      },
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        tag ? '-=0.45' : 0
      );
    }

    if (button) {
      tl.from(
        button,
        {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
        },
        '-=0.58'
      );
    }

    if (component) {
      tl.from(
        component,
        {
          autoAlpha: 0,
          y: 38,
          duration: 0.9,
        },
        '-=0.75'
      );
    }

    if (slides.length) {
      tl.from(
        slides,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.985,
          duration: 0.8,
          stagger: {
            each: 0.12
          },
        },
        '-=0.88'
      );
    }

    if (sliderBottom) {
      tl.from(
        sliderBottom,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
        },
        '-=0.5'
      );
    }
  });
}

testimonials2Reveal();

function hFeaturesReveal() {
  const sections = gsap.utils.toArray('[h-features-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[h-features-tag]');
    const heading = section.querySelector('[h-features-heading]');
    const para = section.querySelector('[h-features-para]');
    const component = section.querySelector('[h-features-component]');
    const blocks = gsap.utils.toArray(section.querySelectorAll('.h-features_block'));
    const sliderBottom = section.querySelector('.slider_bottom_wrap');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%'
      },
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        tag ? '-=0.45' : 0
      );
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
        },
        '-=0.65'
      );
    }

    if (component) {
      tl.from(
        component,
        {
          autoAlpha: 0,
          y: 38,
          duration: 0.9,
        },
        '-=0.68'
      );
    }

    if (blocks.length) {
      tl.from(
        blocks,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.985,
          duration: 0.8,
          stagger: {
            each: 0.12,
          },
        },
        '-=0.78'
      );
    }

    if (sliderBottom) {
      tl.from(
        sliderBottom,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
        },
        '-=0.5'
      );
    }
  });
}

hFeaturesReveal();

function initKindReveal() {
  let ctx = gsap.context(() => {
    const section = document.querySelector("[kind-section]");
    if (!section) return;

    const heading = section.querySelector("[kind-heading]");
    const video = section.querySelector("[kind-video]");
    const para = section.querySelector("[kind-para]");

    gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 38%",
        },
      })
      .from(heading, {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .from(video, {
        y: 50,
        scale: 0.96,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power2.out",
      }, "-=0.6")
      .from(para, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.68");
  });

  return () => ctx.revert();
}

initKindReveal();

function initKindScrub() {
  let ctx = gsap.context(() => {
    const section = document.querySelector("[kind-section]");
    const track = document.querySelector("[kind-track]");

    if (!section || !track) return;

    const heading = section.querySelector("[kind-heading]");
    const para = section.querySelector("[kind-para]");
    const video = section.querySelector("[kind-video]");

    const mm = gsap.matchMedia();

    // Desktop
    mm.add("(min-width: 992px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top -40%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(video, {
          scale: 1.6,
          width: "112%",
          ease: "power3.out",
        }, 0)
        .to([heading, para], {
          filter: "blur(12px)",
          autoAlpha: 0,
          ease: "none",
        }, 0);

      return () => tl.kill();
    });

    // Tablet
    mm.add("(min-width: 768px) and (max-width: 991px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top -40%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(video, {
          scale: 1.4,
          width: "108%",
          ease: "power3.out",
        }, 0)
        .to([heading, para], {
          filter: "blur(12px)",
          autoAlpha: 0,
          ease: "none",
        }, 0);

      return () => tl.kill();
    });

    // Mobile
    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top -40%",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(video, {
          scale: 1.2,
          width: "105%",
          ease: "power3.out",
        }, 0)
        .to([heading, para], {
          filter: "blur(12px)",
          autoAlpha: 0,
          ease: "none",
        }, 0);

      return () => tl.kill();
    });
  });

  return () => ctx.revert();
}

initKindScrub();

function devExReveal() {
  const sections = gsap.utils.toArray('[dev-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[dev-tag]');
    const heading = section.querySelector('[dev-heading]');
    const para = section.querySelector('[dev-para]');
    const list = section.querySelector('[dev-list]');
    const imageWrap = section.querySelector('[dev-img]');
    const image = imageWrap?.querySelector('img');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%',
      },
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        tag ? '-=0.45' : 0
      );
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.75,
        },
        '-=0.68'
      );
    }

    if (list) {
      tl.from(
        list,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.75,
        },
        '-=0.6'
      );
    }

    if (imageWrap) {
      tl.from(
        imageWrap,
        {
          autoAlpha: 0,
          y: 44,
          scale: 0.97,
          duration: 1.1,
        },
        '-=0.66'
      );
    }

    if (image) {
      tl.from(
        image,
        {
          scale: 1.1,
          duration: 1.35,
          ease: 'power2.out',
        },
        '<'
      );
    }
  });
}

devExReveal();

function devExProgress() {

  const sections = gsap.utils.toArray('[dev-section]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const list = section.querySelector('[dev-list]');
    if (!list) return;

    function init() {
      const items = gsap.utils.toArray(list.querySelectorAll('[dev-item]'));
      const dots = gsap.utils.toArray(list.querySelectorAll('[dev-dot]'));
      const track = list.querySelector('.dev-ex_progress');
      const fill = list.querySelector('[dev-progress]');

      if (!items.length || !track || !fill) return;

      let thresholds = [];

      function measure() {
        const trackRect = track.getBoundingClientRect();

        thresholds = dots.map((dot) => {
          const dotRect = dot.getBoundingClientRect();
          const offset = dotRect.top + dotRect.height / 2 - trackRect.top;
          return gsap.utils.clamp(0, 1, offset / trackRect.height);
        });
      }

      function clearActive() {
        items.forEach((item) => item.classList.remove('is-active'));
        gsap.set(fill, { scaleY: 0 });
      }

      function updateItems(progress) {
        let activeIndex = -1;

        thresholds.forEach((threshold, index) => {
          if (progress >= threshold) activeIndex = index;
        });

        items.forEach((item, index) => {
          item.classList.toggle('is-active', index <= activeIndex);
        });

        gsap.set(fill, { scaleY: progress });
      }

      gsap.set(fill, {
        scaleY: 0,
      });

      measure();
      clearActive();

      ScrollTrigger.addEventListener('refreshInit', measure);

      ScrollTrigger.create({
        trigger: list,
        start: 'top 80%',
        end: 'bottom 80%',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateItems(self.progress),
        onEnter: (self) => updateItems(self.progress),
        onEnterBack: (self) => updateItems(self.progress),
        onLeaveBack: clearActive,
      });

      ScrollTrigger.refresh();
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      once: true,
      onEnter: init,
    });
  });
}

devExProgress();

function ctaReveal() {
  const sections = gsap.utils.toArray('[cta-wrap]');

  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[cta-heading]');
    const para = section.querySelector('[cta-para]');
    const buttons = gsap.utils.toArray(section.querySelectorAll('[cta-btn]'));
    const items = gsap.utils.toArray(section.querySelectorAll('[cta-item]'));
    const gaphic = section.querySelector('[cta-img]');
    const background = section.querySelector('[cta-bg-layer]');
    const patterns = section.querySelector('[cta-bg-patterns]');

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      },
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
      },
    });

    if (background) {
      tl.from(background, {
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (patterns) {
      tl.from(
        patterns,
        {
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.4,
          ease: 'power2.out',
        },
        0,
      );
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
        },
        0.14,
      );
    }

    if (buttons.length) {
      tl.from(
        buttons,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.1,
        },
        '-=1',
      );
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
        },
        '-=0.84',
      );
    }

    if (items.length) {
      tl.from(
        items,
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.4,
          stagger: {
            each: 0.04,
          },
        },
        '-=0.8',
      );
    }

    if (gaphic) {
      tl.from(
        gaphic,
        {
          autoAlpha: 0,
          xPercent: 8,
          yPercent: 6,
          scale: 0.9,
          rotation: -4,
          duration: 1.35,
          ease: 'power3.out',
        },
        0.08,
      );

      tl.to(
        gaphic,
        {
          y: 10,
          rotation: 1,
          duration: 2.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        },
        '>',
      );
    }
  });
}

ctaReveal();

/*--- Swiper Sliders ----*/
/*--- Reusable Triangle Progress ---*/
function createTriangleProgress(swiper, progressEl) {
  if (!progressEl) return null;

  if (progressEl._triangleProgress) {
    return progressEl._triangleProgress;
  }

  const ticksEl = progressEl.querySelector('.slider-progress_ticks');
  const indicator = progressEl.querySelector('.slider-progress_indicator');

  if (!ticksEl || !indicator) return null;

  const tickCount = Math.max(2, Number(progressEl.dataset.progressTicks) || 2);

  const waveRadius = Number(progressEl.dataset.progressRadius) || 6;
  const minHeight = 6;
  const maxHeight = 24;

  let indicatorPlaced = false;

  ticksEl.style.setProperty('--tick-count', tickCount);

  for (let index = 0; index < tickCount; index++) {
    const tick = document.createElement('span');

    tick.className = 'slider-progress_tick';
    ticksEl.appendChild(tick);
  }

  const ticks = Array.from(ticksEl.querySelectorAll('.slider-progress_tick'));

  function getCenterX(element) {
    const rect = element.getBoundingClientRect();

    return rect.left + rect.width / 2;
  }

  function moveIndicatorTo(activeTick, targetX, animate = false) {
    const wasInsideTick = indicator.parentElement?.classList.contains('slider-progress_tick');

    const isChangingTick = indicator.parentElement !== activeTick;

    let previousIndicatorCenter = null;

    if (isChangingTick && wasInsideTick && animate) {
      previousIndicatorCenter = getCenterX(indicator);
    }

    if (isChangingTick) {
      activeTick.appendChild(indicator);
    }

    if (previousIndicatorCenter !== null) {
      const activeTickCenter = getCenterX(activeTick);

      gsap.set(indicator, {
        x: previousIndicatorCenter - activeTickCenter,
      });
    }

    if (animate) {
      gsap.to(indicator, {
        x: targetX,
        duration: swiper.params.speed / 1000,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    } else {
      gsap.killTweensOf(indicator, 'x');

      gsap.set(indicator, {
        x: targetX,
      });
    }

    indicatorPlaced = true;
  }

  function render() {
    const progress = Math.max(0, Math.min(1, swiper.progress || 0));
    const livePosition = progress * (ticks.length - 1);
    const currentTick = Math.round(livePosition);
    const activeTick = ticks[currentTick];
    const isDragging = swiper.touchEventsData?.isTouched;

    ticks.forEach((tick, index) => {
      const distance = Math.abs(index - livePosition);
      const strength = Math.max(0, 1 - distance / waveRadius);
      const height = minHeight + (maxHeight - minHeight) * strength;
      const isCurrent = index === currentTick;

      tick.classList.toggle('is-current', isCurrent);

      if (isDragging) {
        gsap.killTweensOf(tick, 'height');
        gsap.set(tick, { height });
      } else {
        gsap.to(tick, {
          height,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    const firstTickCenter = getCenterX(ticks[0]);
    const lastTickCenter = getCenterX(ticks[ticks.length - 1]);

    const tickSpacing = ticks.length > 1 ? (lastTickCenter - firstTickCenter) / (ticks.length -
      1) : 0;

    const indicatorX = (livePosition - currentTick) * tickSpacing;

    if (isDragging) {
      moveIndicatorTo(activeTick, indicatorX, false);
    } else if (!indicatorPlaced) {
      moveIndicatorTo(activeTick, 0, false);
    }

    return {
      activeTick,
    };
  }

  function animateIndicatorToActiveTick() {
    const state = render();

    if (!state) return;

    moveIndicatorTo(state.activeTick, 0, true);
  }

  function handleResize() {
    const state = render();

    if (!state) return;

    moveIndicatorTo(state.activeTick, 0, false);
  }

  swiper.on('setTranslate', render);
  swiper.on('transitionStart', animateIndicatorToActiveTick);
  swiper.on('update', render);
  swiper.on('resize', handleResize);

  render();

  const api = {
    update: render,

    destroy() {
      swiper.off('setTranslate', render);
      swiper.off('transitionStart', animateIndicatorToActiveTick);
      swiper.off('update', render);
      swiper.off('resize', handleResize);

      delete progressEl._triangleProgress;
    },
  };

  progressEl._triangleProgress = api;

  return api;
}

/*--- Stack Slider Animation ---*/
function updateSlides(swiper) {
  swiper.updateSlidesProgress(swiper.translate);

  const slides = Array.from(swiper.slides);

  if (!slides.length) return;

  // Find the slide closest to the center
  const activeSlide = slides.reduce((closest, slide) => {
    return Math.abs(slide.progress) < Math.abs(closest.progress) ?
      slide :
      closest;
  });

  slides.forEach((slide) => {
    const p = slide.progress;
    const abs = Math.abs(p);
    const clamped = Math.min(abs, 2);
    const active = slide === activeSlide;

    // --------------------------------
    // Stack values
    // --------------------------------

    const scale = gsap.utils.interpolate(1, 0.92, clamped);

    const y = gsap.utils.interpolate(0, 12, clamped);

    const z = 0;

    const visibility = Math.min(abs, 1);

    const opacity = gsap.utils.interpolate(
      1,
      0.92,
      visibility
    );

    // --------------------------------
    // IMPORTANT
    // Explicit stacking order
    // --------------------------------

    let zIndex = 1;

    if (active) {
      zIndex = 100;
    } else if (abs < 1) {
      zIndex = 50;
    } else {
      zIndex = 10;
    }

    // --------------------------------
    // Transform
    // --------------------------------

    const transformValues = {
      y,
      z: 0,
      scale,
      opacity,
    };

    const isDragging =
      swiper.touchEventsData?.isTouched;

    if (isDragging) {
      gsap.killTweensOf(
        slide,
        'y,z,scale,opacity'
      );

      gsap.set(slide, {
        ...transformValues,
        zIndex: zIndex,
      });
    } else {
      gsap.to(slide, {
        ...transformValues,
        zIndex: zIndex,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // --------------------------------
    // Active state
    // --------------------------------

    if (
      slide.dataset.activeState === String(active)
    ) {
      return;
    }

    slide.dataset.activeState = String(active);

    // --------------------------------
    // Text
    // --------------------------------

    const textElements = slide.querySelectorAll(
      '.stack_title, .stack_para'
    );

    gsap.to(textElements, {
      opacity: active ? 1 : 0,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: true,
    });

    // --------------------------------
    // Button
    // --------------------------------

    const button = slide.querySelector(
      '.stack_slide_btn'
    );

    if (button) {
      gsap.to(button, {
        opacity: active ? 1 : 0,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
        onStart: () => {
          if (active) {
            button.style.pointerEvents = 'auto';
          }
        },
        onComplete: () => {
          if (!active) {
            button.style.pointerEvents = 'none';
          }
        },
      });
    }

    // --------------------------------
    // Image wrapper
    // --------------------------------

    const imgWrap = slide.querySelector(
      '.stack_img_wrap'
    );

    if (imgWrap) {
      gsap.to(imgWrap, {
        backgroundColor: active ?
          '#008A49' : '#F5F5F5',

        scale: active ? 1 : 0.9,

        y: active ? -6 : 6,

        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    // --------------------------------
    // Image
    // --------------------------------

    const img = slide.querySelector(
      '.stack_img_wrap img'
    );

    if (img) {
      gsap.to(img, {
        opacity: active ? 1 : 0.6,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    // --------------------------------
    // Background glow
    // --------------------------------

    const bg = slide.querySelector(
      '.stack_img-bg'
    );

    if (bg) {
      gsap.to(bg, {
        width: '250%',
        height: '250%',
        boxShadow: active ?
          'inset 0 0 203.5px 173px #CEF993' :
          'inset 0 0 0px 0px rgba(206, 249, 147, 0)',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  });
}

/*--- Stack Slider ---*/
const stackSwiper = new Swiper('.stack_slider', {
  speed: 900,
  centeredSlides: true,
  slideToClickedSlide: true,
  watchSlidesProgress: true,
  followFinger: true,
  grabCursor: true,

  slidesPerView: 3,
  spaceBetween: '4%',

  threshold: 10,
  touchStartPreventDefault: false,

  mousewheel: {
    forceToAxis: true,
  },

  keyboard: {
    enabled: true,
  },

  breakpoints: {
    280: {
      slidesPerView: 1.1,
      spaceBetween: '1%',
      centeredSlides: false,
    },

    768: {
      slidesPerView: 1.8,
      centeredSlides: true,
    },

    992: {
      slidesPerView: 3,
      centeredSlides: true,
    },
  },

  on: {
    init(swiper) {
      updateSlides(swiper);
    },

    setTranslate(swiper) {
      updateSlides(swiper);
    },

    slideChangeTransitionStart(swiper) {
      updateSlides(swiper);
    },
  },
});

createTriangleProgress(
  stackSwiper,
  document.querySelector('.stack_component .slider-progress')
);
/*--- Testimonial Slider ---*/
$('.testimonials2_component').each(function () {
  const component = this;

  const swiper = new Swiper($(component).find('.swiper')[0], {
    speed: 780,
    autoHeight: false,
    followFinger: true,
    freeMode: false,
    grabCursor: true,
    slideToClickedSlide: false,
    slidesPerView: 1,
    spaceBetween: 16,
    rewind: false,

    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },

    mousewheel: {
      forceToAxis: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    breakpoints: {
      280: {
        slidesPerView: 1,
        spaceBetween: '3%',
      },

      768: {
        slidesPerView: 1,
        spaceBetween: '3%',
      },

      992: {
        slidesPerView: 1.5,
        spaceBetween: '3%',
      },
    },

    slideActiveClass: 'is-active',
    slideDuplicateActiveClass: 'is-active',
  });

  createTriangleProgress(swiper, component.querySelector('.slider-progress'));
});
/*--- Features Slider ---*/
$('.h-features_component').each(function () {
  const component = this;

  const swiper = new Swiper($(component).find('.swiper')[0], {
    speed: 780,
    autoHeight: false,
    followFinger: true,
    centeredSlides: true,
    freeMode: false,
    grabCursor: true,
    slideToClickedSlide: false,
    slidesPerView: 1,
    spaceBetween: 32,
    rewind: false,

    mousewheel: {
      forceToAxis: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    breakpoints: {
      280: {
        slidesPerView: 1.1,
        spaceBetween: 12,
      },

      768: {
        slidesPerView: 1.6,
        spaceBetween: 24,
      },

      992: {
        slidesPerView: 2.6,
      },
    },

    slideActiveClass: 'is-active',
    slideDuplicateActiveClass: 'is-active',
  });

  createTriangleProgress(swiper, component.querySelector('.slider-progress'));
});
