gsap.set(".page-wrapper", { opacity: 1 });

const marqueeIx = () => {
  const tl = gsap.timeline({ repeat: -1 })

  tl.to('[marquee-track]', { x: '-100%', ease: 'none', duration: 66 })
}
marqueeIx();

function heroReveal() {

  const hero = document.querySelector("[hero-wrap]");
  const navbar = document.querySelector("[navbar-component]");

  if (!hero) return;

  const tag = hero.querySelector("[hero-tag]");
  const heading = hero.querySelector("[hero-heading]");
  const para = hero.querySelector("[hero-para]");
  const buttons = hero.querySelectorAll("[hero-btn]");
  const items = hero.querySelectorAll("[hero-item]");
  const image = hero.querySelector("[hero-img]");

  const tl = gsap.timeline({
    defaults: {
      ease: "power2.out"
    }
  });

  if (navbar) {
    tl.from(navbar, {
      y: "-1.5rem",
      opacity: 0,
      duration: 0.6
    });
  }

  if (tag) {
    tl.from(tag, {
      y: "1rem",
      opacity: 0,
      duration: 0.55
    }, "-=0.5");
  }

  if (heading) {
    tl.from(heading, {
      y: "2rem",
      opacity: 0,
      duration: 0.75
    }, "-=0.4");
  }

  if (para) {
    tl.from(para, {
      y: "1.5rem",
      opacity: 0,
      duration: 0.6
    }, "-=0.6");
  }

  if (buttons.length) {
    tl.from(buttons, {
      y: "1rem",
      opacity: 0,
      duration: 0.6,
      stagger: 0.1
    }, "-=0.55");
  }

  if (items.length) {
    tl.from(items, {
      y: "1rem",
      opacity: 0,
      duration: 0.6,
      stagger: 0.1
    }, "-=0.65");
  }

  if (image) {
    tl.from(image, {
      y: "2.5rem",
      scale: 0.97,
      opacity: 0,
      duration: 1
    }, "-=0.78");
  }

}

heroReveal();

function yCashfreeReveal() {
  const sections = gsap.utils.toArray('[y-cashfree-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[y-cashfree-tag]');
    const heading = section.querySelector('[y-cashfree-heading]');
    const tabContent = section.querySelector('[tab-content]');
    const accordionList = section.querySelector('[tab-accordion-list]');

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
        y: 20,
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

    if (tabContent) {
      tl.from(
        tabContent,
        {
          autoAlpha: 0,
          y: 36,
          scale: 0.985,
          duration: 0.95,
        },
        '-=0.66'
      );
    }

    if (accordionList) {
      tl.from(
        accordionList,
        {
          autoAlpha: 0,
          y: 30,
          duration: 0.85,
        },
        '-=0.74'
      );
    }
  });
}

yCashfreeReveal();

function yCashfreeTabAccordion() {

  const sections = document.querySelectorAll('[y-cashfree-tab-section]');
  sections.forEach((section) => {
    const list = section.querySelector('[tab-accordion-list]');
    const accordions = list ? [...list.querySelectorAll('[tab-accordion]')] : [];
    const panes = [...section.querySelectorAll('[tab-pane]')];
    if (!accordions.length || !panes.length) return;

    const duration = Number(list.dataset.duration || 14);
    let current = 0;
    let autoTween = null;

    function setActivePane(index) {
      panes.forEach((pane, i) => {
        pane.classList.toggle('is-active', i === index);
      });
    }

    function closeAccordion(accordion) {
      const body = accordion.querySelector('[tab-accordion-body]');
      const content = accordion.querySelector('[tab-accordion-content]');
      const progress = accordion.querySelector('[tab-accordion-progress]');
      if (!body || !content) return;

      gsap.killTweensOf(progress);
      gsap.set(progress, { scaleX: 0 });
      gsap.timeline()
        .to(content, { opacity: 0, duration: 0.3, ease: 'power2.out' })
        .to(body, { height: 0, duration: 0.4, ease: 'power2.out' }, '<');
      accordion.classList.remove('is-active');
    }

    function openAccordion(index) {
      autoTween?.kill();

      current = index;
      setActivePane(index);

      const lockedHeight = list.offsetHeight;
      gsap.set(list, { minHeight: lockedHeight });

      accordions.forEach((accordion, i) => {
        if (i !== index) closeAccordion(accordion);
      });

      const accordion = accordions[index];
      const body = accordion.querySelector('[tab-accordion-body]');
      const content = accordion.querySelector('[tab-accordion-content]');
      const progress = accordion.querySelector('[tab-accordion-progress]');

      gsap.killTweensOf(progress);
      gsap.set(progress, { scaleX: 0 });

      const contentHeight = content.offsetHeight;
      gsap.timeline()
        .to(body, { height: contentHeight, duration: 0.4, ease: 'power2.out' })
        .to(content, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<');

      accordion.classList.add('is-active');
      gsap.delayedCall(0.46, () => {
        gsap.set(list, { clearProps: 'minHeight' });
      });

      autoTween = gsap.to(progress, {
        scaleX: 1,
        duration,
        ease: 'none',
        onComplete: () => {
          current = (current + 1) % accordions.length;
          openAccordion(current);
        }
      });
    }

    function startProgress() {
      if (autoTween) {
        autoTween.resume();
      } else {
        openAccordion(current);
      }
    }

    function pauseProgress() {
      autoTween?.pause();
    }

    accordions.forEach((accordion, index) => {
      const body = accordion.querySelector('[tab-accordion-body]');
      const content = accordion.querySelector('[tab-accordion-content]');
      const progress = accordion.querySelector('[tab-accordion-progress]');
      const head = accordion.querySelector('[tab-accordion-head]');
      gsap.set(body, { height: 0 });
      gsap.set(content, { opacity: 0 });
      gsap.set(progress, { scaleX: 0 });
      head.addEventListener('click', () => {
        current = index;
        openAccordion(current);
      });
    });

    ScrollTrigger.create({
      trigger: list,
      start: 'top 85%',
      end: 'bottom top',
      onEnter: startProgress,
      onEnterBack: startProgress,
      onLeave: pauseProgress,
      onLeaveBack: pauseProgress
    });
  });
}
yCashfreeTabAccordion();

function paymentOptions() {
  const sections = gsap.utils.toArray("[payment-op-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector("[payment-op-tag]");
    const heading = section.querySelector("[payment-op-heading]");
    const tabMenu = section.querySelector("[tab-menu]");
    const tabLinks = gsap.utils.toArray(
      section.querySelectorAll("[tab-link]")
    );
    const tabContent = section.querySelector("[tab-content]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top 76%"
      }
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 20,
        duration: 0.65
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8
        },
        tag ? "-=0.48" : 0
      );
    }

    if (tabMenu) {
      tl.from(
        tabMenu,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7
        },
        "-=0.65"
      );
    }

    if (tabLinks.length) {
      tl.from(
        tabLinks,
        {
          autoAlpha: 0,
          y: 12,
          duration: 0.5,
          stagger: 0.07
        },
        "<+=0.1"
      );
    }

    if (tabContent) {
      tl.from(
        tabContent,
        {
          autoAlpha: 0,
          y: 38,
          scale: 0.985,
          duration: 0.95
        },
        "-=0.65"
      );
    }
  });
}

paymentOptions();

/* Tabs change */
function initTabAnimation() {
  document.querySelectorAll("[tab-section]").forEach((section) => {
    const tabComponent = section.querySelector("[tab-component]");
    if (!tabComponent) return;

    const tabLinks = Array.from(
      tabComponent.querySelectorAll("[tab-menu] [tab-link]")
    );
    const tabPanes = Array.from(
      tabComponent.querySelectorAll("[tab-content] [tab-pane]")
    );

    let activeIndex = 0;

    // Initial state
    tabLinks.forEach((link, i) => {
      link.classList.toggle("is-active", i === activeIndex);
      tabPanes[i]?.classList.toggle("is-active", i === activeIndex);
    });

    function activateTab(index) {
      if (index === activeIndex) return;

      tabLinks[activeIndex].classList.remove("is-active");
      tabPanes[activeIndex]?.classList.remove("is-active");

      activeIndex = index;

      const activeButton = tabLinks[activeIndex];
      const activePane = tabPanes[activeIndex];

      activeButton.classList.add("is-active");
      activePane?.classList.add("is-active");

      const wrapper = tabComponent.querySelector("[tab-menu]");

      requestAnimationFrame(() => {
        wrapper.scrollTo({
          left: activeButton.offsetLeft -
            (wrapper.clientWidth - activeButton.clientWidth) / 2,
          behavior: "smooth"
        });
      });
    }

    tabLinks.forEach((link, idx) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        activateTab(idx);
      });
    });
  });
}

initTabAnimation();

function tabAccordionAnimation() {
  const components = document.querySelectorAll("[tab-accordion-list]");

  components.forEach((component) => {
    const accordions = [...component.querySelectorAll("[tab-accordion]")];

    if (!accordions.length) return;

    const duration = Number(component.dataset.duration || 16);

    let current = 0;
    let autoTween = null;

    function closeAccordion(accordion) {
      const body = accordion.querySelector("[tab-accordion-body]");
      const content = accordion.querySelector("[tab-accordion-content]");
      const progress = accordion.querySelector("[tab-accordion-progress]");

      gsap.killTweensOf(progress);

      gsap.set(progress, {
        scaleX: 0
      });

      gsap.timeline()
        .to(content, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out"
        })
        .to(body, {
          height: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "<");

      accordion.classList.remove("is-active");
    }

    function openAccordion(index) {
      autoTween?.kill();

      const lockedHeight = component.offsetHeight;
      gsap.set(component, { minHeight: lockedHeight });

      accordions.forEach((accordion, i) => {
        if (i !== index) {
          closeAccordion(accordion);
        }
      });

      current = index;

      const accordion = accordions[index];
      const body = accordion.querySelector("[tab-accordion-body]");
      const content = accordion.querySelector("[tab-accordion-content]");
      const progress = accordion.querySelector("[tab-accordion-progress]");

      gsap.killTweensOf(progress);

      gsap.set(progress, {
        scaleX: 0
      });

      const contentHeight = content.offsetHeight;

      gsap.timeline()
        .to(body, {
          height: contentHeight,
          duration: 0.4,
          ease: "power2.out"
        })
        .to(content, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "<");

      accordion.classList.add("is-active");

      gsap.delayedCall(0.46, () => {
        gsap.set(component, { clearProps: "minHeight" });
      });

      autoTween = gsap.to(progress, {
        scaleX: 1,
        duration,
        ease: "none",
        onComplete: () => {
          current = (current + 1) % accordions.length;
          openAccordion(current);
        }
      });
    }

    function start() {
      stop();
      current = 0;
      openAccordion(current);
    }

    function stop() {
      autoTween?.kill();

      accordions.forEach((accordion) => {
        closeAccordion(accordion);
      });
    }

    accordions.forEach((accordion, index) => {
      const head = accordion.querySelector("[tab-accordion-head]");
      const body = accordion.querySelector("[tab-accordion-body]");
      const content = accordion.querySelector("[tab-accordion-content]");
      const progress = accordion.querySelector("[tab-accordion-progress]");

      gsap.set(body, { height: 0 });
      gsap.set(content, { opacity: 0 });
      gsap.set(progress, {
        scaleX: 0
      });

      head.addEventListener("click", () => {
        current = index;
        openAccordion(current);
      });
    });

    component.tabAccordion = {
      start,
      stop
    };
  });

  function updateActivePane() {
    document.querySelectorAll("[tab-pane]").forEach((pane) => {
      const accordion = pane.querySelector("[tab-accordion-list]");

      if (!accordion?.tabAccordion) return;

      if (pane.classList.contains("is-active")) {
        accordion.tabAccordion.start();
      } else {
        accordion.tabAccordion.stop();
      }
    });
  }

  updateActivePane();

  const observer = new MutationObserver(() => {
    updateActivePane();
  });

  document.querySelectorAll("[tab-pane]").forEach((pane) => {
    observer.observe(pane, {
      attributes: true,
      attributeFilter: ["class"]
    });
  });
}

tabAccordionAnimation();

/*--- Business Stack Cards ---*/
function businessStackHeader(scope = document) {
  const ctx = gsap.context(() => {
    gsap.utils
      .toArray(scope.querySelectorAll(".section_business-stack"))
      .forEach((section) => {
        const wrap = section.querySelector(".business-stack_wrap");
        const header = section.querySelector(".business-stack_header");

        if (!wrap || !header) return;

        gsap.to(header, {
          opacity: 0,
          yPercent: -60,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrap,
            start: "bottom bottom",
            end: "bottom 68%",
            scrub: true,
            invalidateOnRefresh: true
          }
        });
      });

    ScrollTrigger.refresh();
  }, scope);

  return () => ctx.revert();
}
if (window.innerWidth > 991) {
  businessStackHeader();
}

function businessStack(scope = document) {
  const ctx = gsap.context(() => {
    const sections = gsap.utils.toArray(
      scope.querySelectorAll(".section_business-stack")
    );

    sections.forEach((section) => {
      const cards = gsap.utils.toArray(
        section.querySelectorAll(".business-stack_item")
      );
      const pills = gsap.utils.toArray(
        section.querySelectorAll(".business-stack_progress_pill")
      );
      const fills = gsap.utils.toArray(
        section.querySelectorAll(".business-stack_progress")
      );

      if (!cards.length) return;

      const setActivePill = (activeIndex) => {
        pills.forEach((pill, index) => {
          pill.classList.toggle("is-active", index === activeIndex);
        });
      };

      const getStickyTop = (card) =>
        parseFloat(getComputedStyle(card).top) || 256;

      gsap.set(cards, {
        zIndex: (index) => index + 1,
        transformPerspective: 1400,
        transformOrigin: "50% 0%",
        backfaceVisibility: "hidden"
      });

      gsap.set(fills, {
        scaleY: 0,
        transformOrigin: "top"
      });

      setActivePill(0);

      cards.forEach((card, index) => {
        const previousCard = cards[index - 1];

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: () => `top ${getStickyTop(card)}px`,
            scrub: 0.65,
            invalidateOnRefresh: true,

            onEnter: () => setActivePill(index),
            onEnterBack: () => setActivePill(index),
            onLeaveBack: () => setActivePill(Math.max(0, index - 1))
          }
        });

        timeline.fromTo(
          card,
          {
            opacity: 0.15,
            yPercent: 14,
            scale: 0.93,
            rotationX: 9,
            rotationZ: 0.5
          },
          {
            opacity: 1,
            yPercent: 0,
            scale: 1,
            rotationX: 0,
            rotationZ: 0,
            ease: "power3.out"
          },
          0
        );

        timeline.to(
          fills[index],
          {
            scaleY: 1,
            ease: "none"
          },
          0
        );

        if (previousCard) {
          timeline.to(
            previousCard,
            {
              opacity: 0,
              yPercent: -7,
              scale: 0.94,
              rotationX: -8,
              rotationZ: -0.4,
              ease: "power2.inOut"
            },
            0
          );
        }
      });
    });

    ScrollTrigger.refresh();
  }, scope);

  return () => ctx.revert();
}
if (window.innerWidth > 991) {
  businessStack();
}

function fCheckoutReveal() {
  const sections = gsap.utils.toArray('[f-checkout-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector('[f-checkout-tag]');
    const heading = section.querySelector('[f-checkout-heading]');
    const para = section.querySelector('[f-checkout-para]');
    const sliderComponent = section.querySelector('.f-checkout_component');
    const blocks = gsap.utils.toArray(section.querySelectorAll('.f-checkout_block'));
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
        y: 20,
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
        '-=0.58'
      );
    }

    if (sliderComponent) {
      tl.from(
        sliderComponent,
        {
          autoAlpha: 0,
          y: 38,
          duration: 0.9,
        },
        '-=0.72'
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
            each: 0.12
          },
        },
        '-=0.8'
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

fCheckoutReveal();

function goLiveReveal() {
  const sections = gsap.utils.toArray('[go-live-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const circles = gsap.utils.toArray(section.querySelectorAll('[go-live-circle]'));
    const pops = gsap.utils.toArray(section.querySelectorAll('[go-live-pop]'));
    const flow = section.querySelector('[go-live-flash]');
    const layers = gsap.utils.toArray(
      section.querySelectorAll('.go-live_graphic_layer, .go-live_graphic_bottom_layer')
    );
    const tag = section.querySelector('[go-live-tag]');
    const heading = section.querySelector('[go-live-heading]');
    const para = section.querySelector('[go-live-para]');
    const button = section.querySelector('[go-live-btn]');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 72%'
      },
    });

    if (tag) {
      tl.from(
        tag,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.65,
        },
      );
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        '-=0.49'
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
        '-=0.6'
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
        '-=0.56'
      );
    }

    if (circles.length) {
      tl.from(
        circles,
        {
          autoAlpha: 0,
          scale: 0.7,
          rotation: -18,
          duration: 1.1,
          stagger: 0.15,
        },
        0
      );
    }

    if (pops.length) {
      tl.from(
        pops,
        {
          autoAlpha: 0,
          scale: 0,
          rotation: () => gsap.utils.random(-25, 25),
          duration: 0.6,
          ease: 'back.out(2.2)',
          stagger: {
            each: 0.08,
            from: 'random',
          },
        },
        '-=0.55'
      );
    }

    if (flow) {
      tl.from(
        flow,
        {
          opacity: 0,
          scale: 0.96,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }

  });
}

goLiveReveal();

function initGoLivePopMomentumHover() {
  gsap.registerPlugin(InertiaPlugin);

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const xyMultiplier = 30;
  const rotationMultiplier = 20;
  const inertiaResistance = 200;

  const clampXY = gsap.utils.clamp(-880, 880);
  const clampRot = gsap.utils.clamp(-60, 60);

  const roots = gsap.utils.toArray('[go-live-section]');

  roots.forEach((root) => {
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;
    let rafId = null;

    root.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX;
        velY = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;
        rafId = null;
      });
    });

    const items = gsap.utils.toArray(root.querySelectorAll('[go-live-pop]'));

    items.forEach((item) => {
      item.addEventListener('mouseenter', (e) => {
        const { left, top, width, height } = item.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const offsetX = e.clientX - centerX;
        const offsetY = e.clientY - centerY;

        const rawTorque = offsetX * velY - offsetY * velX;
        const leverDist = Math.hypot(offsetX, offsetY) || 1;
        const angularForce = rawTorque / leverDist;

        const velocityX = clampXY(velX * xyMultiplier);
        const velocityY = clampXY(velY * xyMultiplier);
        const rotationVelocity = clampRot(angularForce * rotationMultiplier);

        gsap.to(item, {
          inertia: {
            x: { velocity: velocityX, end: 0 },
            y: { velocity: velocityY, end: 0 },
            rotation: { velocity: rotationVelocity, end: 0 },
            resistance: inertiaResistance,
          },
        });
      });
    });
  });
}

initGoLivePopMomentumHover();

function showcaseReveal() {
  const sections = gsap.utils.toArray("[show-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector("[show-heading]");
    const para = section.querySelector("[show-para]");
    const blocks = gsap.utils.toArray(
      section.querySelectorAll("[show-block]")
    );
    const images = blocks
      .map((block) => block.querySelector(".showcase_img_wrap img"))
      .filter(Boolean);

    const tl = gsap.timeline({
      defaults: {
        ease: "power2.out"
      },
      scrollTrigger: {
        trigger: section,
        start: "top 72%"
      }
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8
      });
    }

    if (para) {
      tl.from(para, {
        y: "1.5rem",
        opacity: 0,
        duration: 0.6
      }, "-=0.6");
    }

    tl.from(
      blocks,
      {
        autoAlpha: 0,
        y: 42,
        scale: 0.975,
        duration: 0.95,
        stagger: {
          each: 0.14
        }
      },
      heading ? "-=0.6" : 0
    );

    tl.from(
      images,
      {
        scale: 1.12,
        duration: 1.25,
        ease: "power3.out",
        stagger: {
          each: 0.14
        }
      },
      heading ? 0.3 : 0.1
    );
  });
}

showcaseReveal();

function testimonialReveal() {
  const sections = gsap.utils.toArray("[testimonial-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const tag = section.querySelector("[testimonial-tag]");
    const heading = section.querySelector("[testimonial-heading]");
    const slider = section.querySelector(".testimonials_slider");
    const sliderBottom = section.querySelector(".testimonials_slider_bottom");
    const slideContent = gsap.utils.toArray(
      section.querySelectorAll("[testimonial-item] .testimonials_grid")
    );

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top 76%"
      }
    });

    if (tag) {
      tl.from(tag, {
        autoAlpha: 0,
        y: 18,
        duration: 0.65
      });
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 42,
          duration: 0.95
        },
        tag ? "-=0.48" : 0
      );
    }

    if (slider) {
      tl.from(
        slider,
        {
          autoAlpha: 0,
          y: 38,
          duration: 0.9
        },
        "-=0.88"
      );
    }

    if (slideContent.length) {
      tl.from(
        slideContent,
        {
          autoAlpha: 0,
          y: 28,
          scale: 0.985,
          duration: 0.8,
          stagger: 0.12
        },
        "-=0.66"
      );
    }

    if (sliderBottom) {
      tl.from(
        sliderBottom,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.6
        },
        "-=0.66"
      );
    }
  });
}

testimonialReveal();

function stackReveal() {
  const sections = gsap.utils.toArray("[stack-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector("[stack-heading]");
    const para = section.querySelector("[stack-para]");
    const sliderParent = section.querySelector(".stack_slider_parent");
    const background = section.querySelector("[stack-img]");
    const sliderBottom = section.querySelector(".stack_slider_bottom");
    const button = section.querySelector("[stack-btn]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: section,
        start: "top 76%"
      }
    });

    if (heading) {
      tl.from(heading, {
        autoAlpha: 0,
        y: 32,
        duration: 0.8
      });
    }

    if (para) {
      tl.from(para, {
        y: "1.5rem",
        opacity: 0,
        duration: 0.6
      }, "-=0.6");
    }

    if (background) {
      tl.from(
        background,
        {
          autoAlpha: 0,
          scale: 1.06,
          duration: 1.25,
          ease: "power2.out"
        },
        0.1
      );
    }

    if (sliderParent) {
      tl.from(
        sliderParent,
        {
          autoAlpha: 0,
          y: 44,
          duration: 1
        },
        "-=1.1"
      );
    }

    if (sliderBottom) {
      tl.from(
        sliderBottom,
        {
          autoAlpha: 0,
          y: 18,
          duration: 0.65
        },
        "-=0.9"
      );
    }

    if (button) {
      tl.from(
        button,
        {
          autoAlpha: 0,
          y: 14,
          duration: 0.6
        },
        "-=0.42"
      );
    }
  });
}

stackReveal();

function chargesReveal() {
  const sections = gsap.utils.toArray('[charges-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const imageWrap = section.querySelector('[charges-img]');
    const image = imageWrap?.querySelector('img');
    const tag = section.querySelector('[charges-tag]');
    const heading = section.querySelector('[charges-heading]');
    const items = gsap.utils.toArray(section.querySelectorAll('[charges-item]'));
    const button = section.querySelector('[charges-btn]');

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 76%'
      },
    });

    if (imageWrap) {
      tl.from(imageWrap, {
        autoAlpha: 0,
        xPercent: -5,
        scale: 0.97,
        duration: 1.1,
      });
    }

    if (image) {
      tl.from(
        image,
        {
          scale: 1.1,
          duration: 1.35,
          ease: 'power2.out',
        },
        0
      );
    }

    if (tag) {
      tl.from(
        tag,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.65,
        },
        0.1
      );
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        '-=1.2'
      );
    }

    if (items.length) {
      tl.from(
        items,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: {
            each: 0.1
          },
        },
        '-=0.9'
      );
    }

    if (button) {
      tl.from(
        button,
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
        },
        '-=0.66'
      );
    }
  });
}

chargesReveal();

function ctaReveal() {
  const sections = gsap.utils.toArray("[cta-wrap]");

  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector("[cta-heading]");
    const para = section.querySelector("[cta-para]");
    const items = gsap.utils.toArray(section.querySelectorAll("[cta2-item]"));
    const buttons = gsap.utils.toArray(section.querySelectorAll("[cta-btn]"));
    const gaphic = section.querySelector(".cta_img_wrap");
    const background = section.querySelector("[cta-bg-layer]");
    const patterns = section.querySelector("[cta-bg-patterns]");

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out"
      },
      scrollTrigger: {
        trigger: section,
        start: "top 78%"
      }
    });

    if (background) {
      tl.from(background, {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    if (patterns) {
      tl.from(
        patterns,
        {
          autoAlpha: 0,
          scale: 0.94,
          duration: 1.4,
          ease: "power2.out"
        },
        0
      );
    }

    if (heading) {
      tl.from(
        heading,
        {
          autoAlpha: 0,
          y: 40,
          duration: 0.9
        },
        0.14
      );
    }

    if (para) {
      tl.from(
        para,
        {
          autoAlpha: 0,
          y: 24,
          duration: 0.7
        },
        "-=1.1"
      );
    }

    if (items.length) {
      tl.from(
        items,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: {
            each: 0.09
          }
        },
        "-=0.88"
      );
    }

    if (buttons.length) {
      tl.from(
        buttons,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.1
        },
        "-=0.9"
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
          ease: "power3.out"
        },
        0.08
      );

      tl.to(
        gaphic,
        {
          y: 10,
          rotation: 1,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        },
        ">"
      );
    }
  });
}

ctaReveal();

function faqTabReveal() {
  const sections = gsap.utils.toArray('[faq-wrap]');
  if (!sections.length) return;

  sections.forEach((section) => {
    const heading = section.querySelector('[faq-heading]');
    const tabMenu = section.querySelector('[tab-menu]');
    const tabLinks = gsap.utils.toArray(section.querySelectorAll('[tab-link]'));
    const tabContent = section.querySelector('[tab-content]');

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

    if (tabMenu) {
      tl.from(
        tabMenu,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.68'
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
          y: 36,
          duration: 0.95,
        },
        '-=0.64'
      );
    }
  });
}

faqTabReveal();

function faqAnimation() {
  const faqComponents = document.querySelectorAll("[faq-component]");

  faqComponents.forEach((component, componentIndex) => {
    const accordions = component.querySelectorAll("[faq-accordion]");
    const openInitially = component.getAttribute("data-open-initially") === "true";
    const singleOpen = component.getAttribute("data-single-open") === "true";

    accordions.forEach((accordion, index) => {
      const head = accordion.querySelector("[faq-accordion-head]");
      const body = accordion.querySelector("[faq-accordion-body]");
      const content = accordion.querySelector("[faq-accordion-content]");
      const icon = accordion.querySelector("[faq-accordion-icon]");

      // Remove Webflow's is-active for clean JS control
      accordion.classList.remove("is-active");
      icon && icon.classList.remove("is-active");

      // Create unique IDs for ARIA
      const headId = `faq-head-${componentIndex}-${index}`;
      const bodyId = `faq-body-${componentIndex}-${index}`;
      head.setAttribute("id", headId);
      head.setAttribute("role", "button");
      head.setAttribute("aria-controls", bodyId);
      head.setAttribute("aria-expanded", "false");

      body.setAttribute("id", bodyId);
      body.setAttribute("role", "region");
      body.setAttribute("aria-hidden", "true");

      // Decide which should open initially
      if (openInitially && index === 0) {
        gsap.set(body, { height: "auto" });
        gsap.set(content, { opacity: 1, y: 0 });
        accordion.classList.add("is-active");
        icon && icon.classList.add("is-active");
        head.setAttribute("aria-expanded", "true");
        body.setAttribute("aria-hidden", "false");
      } else {
        gsap.set(body, { height: 0 });
        gsap.set(content, { opacity: 0 });
      }

      // Click Handler
      head.addEventListener("click", () => {
        const isOpen = accordion.classList.contains("is-active");

        if (singleOpen) {
          accordions.forEach((otherAcc, otherIndex) => {
            if (otherAcc !== accordion) {
              const otherBody = otherAcc.querySelector(
                "[faq-accordion-body]");
              const otherIcon = otherAcc.querySelector(
                "[faq-accordion-icon]");
              const otherHead = otherAcc.querySelector(
                "[faq-accordion-head]");
              const otherContent = otherAcc.querySelector(
                "[faq-accordion-content]");
              gsap.timeline()
                .to(otherContent, {
                  opacity: 0,
                  duration: 0.2,
                  ease: "power2.out"
                })
                .to(otherBody, {
                  height: 0,
                  duration: 0.35,
                  ease: "power2.out"
                }, "<");
              otherAcc.classList.remove("is-active");
              otherIcon && otherIcon.classList.remove("is-active");
              otherHead.setAttribute("aria-expanded", "false");
              otherBody.setAttribute("aria-hidden", "true");
            }
          });
        }

        if (!isOpen) {
          const contentHeight = content.offsetHeight;
          const tl = gsap.timeline();

          tl.to(body, {
              height: contentHeight,
              duration: 0.45,
              ease: "power2.out"
            })
            .to(content, {
              opacity: 1,
              duration: 0.4,
              ease: "power2.out"
            }, "<");

          accordion.classList.add("is-active");
          icon && icon.classList.add("is-active");
          head.setAttribute("aria-expanded", "true");
          body.setAttribute("aria-hidden", "false");
        } else {
          const tl = gsap.timeline();
          tl.to(content, {
              opacity: 0,
              duration: 0.2,
              ease: "power2.out"
            })
            .to(body, {
              height: 0,
              duration: 0.35,
              ease: "power2.out"
            }, "<");
          accordion.classList.remove("is-active");
          icon && icon.classList.remove("is-active");
          head.setAttribute("aria-expanded", "false");
          body.setAttribute("aria-hidden", "true");
        }
      });
    });
  });
}

faqAnimation();

/*--- Swiper Sliders ----*/
/*--- Reusable Triangle Progress ---*/
function createTriangleProgress(swiper, progressEl) {
  if (!progressEl) return null;

  if (progressEl._triangleProgress) {
    return progressEl._triangleProgress;
  }

  const ticksEl = progressEl.querySelector(".slider-progress_ticks");
  const indicator = progressEl.querySelector(".slider-progress_indicator");

  if (!ticksEl || !indicator) return null;

  const tickCount = Math.max(
    2,
    Number(progressEl.dataset.progressTicks) || 2
  );

  const waveRadius = Number(progressEl.dataset.progressRadius) || 6;
  const minHeight = 6;
  const maxHeight = 24;

  let indicatorPlaced = false;

  ticksEl.style.setProperty("--tick-count", tickCount);

  for (let index = 0; index < tickCount; index++) {
    const tick = document.createElement("span");

    tick.className = "slider-progress_tick";
    ticksEl.appendChild(tick);
  }

  const ticks = Array.from(
    ticksEl.querySelectorAll(".slider-progress_tick")
  );

  function getCenterX(element) {
    const rect = element.getBoundingClientRect();

    return rect.left + rect.width / 2;
  }

  function moveIndicatorTo(activeTick, targetX, animate = false) {
    const wasInsideTick = indicator.parentElement?.classList.contains(
      "slider-progress_tick"
    );

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
        x: previousIndicatorCenter - activeTickCenter
      });
    }

    if (animate) {
      gsap.to(indicator, {
        x: targetX,
        duration: swiper.params.speed / 1000,
        ease: "power2.out",
        overwrite: "auto"
      });
    } else {
      gsap.killTweensOf(indicator, "x");

      gsap.set(indicator, {
        x: targetX
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

      tick.classList.toggle("is-current", isCurrent);

      if (isDragging) {
        gsap.killTweensOf(tick, "height");
        gsap.set(tick, { height });
      } else {
        gsap.to(tick, {
          height,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });

    const firstTickCenter = getCenterX(ticks[0]);
    const lastTickCenter = getCenterX(ticks[ticks.length - 1]);

    const tickSpacing =
      ticks.length > 1 ?
      (lastTickCenter - firstTickCenter) / (ticks.length - 1) :
      0;

    const indicatorX = (livePosition - currentTick) * tickSpacing;

    if (isDragging) {
      moveIndicatorTo(activeTick, indicatorX, false);
    } else if (!indicatorPlaced) {
      moveIndicatorTo(activeTick, 0, false);
    }

    return {
      activeTick
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

  swiper.on("setTranslate", render);
  swiper.on("transitionStart", animateIndicatorToActiveTick);
  swiper.on("update", render);
  swiper.on("resize", handleResize);

  render();

  const api = {
    update: render,

    destroy() {
      swiper.off("setTranslate", render);
      swiper.off("transitionStart", animateIndicatorToActiveTick);
      swiper.off("update", render);
      swiper.off("resize", handleResize);

      delete progressEl._triangleProgress;
    }
  };

  progressEl._triangleProgress = api;

  return api;
}

/*--- Stack Slider ---*/
function updateSlides(swiper) {
  swiper.updateSlidesProgress(swiper.translate);

  const slides = Array.from(swiper.slides);

  if (!slides.length) return;

  const activeSlide = slides.reduce((closest, slide) => {
    return Math.abs(slide.progress) < Math.abs(closest.progress) ? slide : closest;
  });

  slides.forEach((slide) => {
    const p = slide.progress;
    const abs = Math.abs(p);
    const clamped = Math.min(abs, 2);
    const active = slide === activeSlide;

    const scale = gsap.utils.interpolate(1, 0.92, clamped);
    const y = gsap.utils.interpolate(0, 12, clamped);
    const z = gsap.utils.interpolate(0, -35, clamped);

    const visibility = Math.min(abs, 1);
    const opacity = gsap.utils.interpolate(1, 0.92, visibility);

    const transformValues = {
      y,
      z,
      scale,
      opacity,
    };

    const isDragging = swiper.touchEventsData?.isTouched;

    if (isDragging) {
      gsap.killTweensOf(slide, 'y,z,scale,opacity');
      gsap.set(slide, transformValues);
    } else {
      gsap.to(slide, {
        ...transformValues,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (slide.dataset.activeState === String(active)) return;

    slide.dataset.activeState = String(active);

    gsap.to(slide.querySelectorAll('.stack_title, .stack_para'), {
      // color: active ? '#ffffff' : '#7B7B7B',
      opacity: active ? 1 : 0,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: true,
    });

    const imgWrap = slide.querySelector('.stack_img_wrap');

    if (imgWrap) {
      gsap.to(imgWrap, {
        backgroundColor: active ? '#008A49' : '#F5F5F5',
        scale: active ? 1 : 0.9,
        y: active ? -6 : 6,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    const img = slide.querySelector('.stack_img_wrap img');

    if (img) {
      gsap.to(img, {
        opacity: active ? 1 : 0.6,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    const bg = slide.querySelector('.stack_img-bg');

    if (bg) {
      gsap.to(bg, {
        width: active ? '250%' : '250%',
        height: active ? '250%' : '250%',
        boxShadow: active ? 'inset 0 0 203.5px 173px #CEF993' :
          'inset 0 0 0px 0px rgba(206, 249, 147, 0)',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  });
}

const stackSwiper = new Swiper('.stack_slider', {
  speed: 900,
  centeredSlides: true,
  slideToClickedSlide: true,
  watchSlidesProgress: true,
  followFinger: true,
  grabCursor: true,

  slidesPerView: 3,
  spaceBetween: '4%',

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
    },

    992: {
      slidesPerView: 3,
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

createTriangleProgress(stackSwiper, document.querySelector('.stack_component .slider-progress'));

/*--- Business Stack Tablet and below slider ---*/
if (window.innerWidth < 991) {
  $(".business-stack_component").each(function () {
    const $component = $(this);

    const swiper = new Swiper($component.find(".swiper")[0], {
      speed: 780,
      loop: true,
      slidesPerView: 1.2,
      spaceBetween: 16,
      rewind: false,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },

      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },

      breakpoints: {
        280: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 1.1
        }
      },

      pagination: {
        el: $component.find(".business-stack_progress_wrap")[0],
        bulletActiveClass: "is-active",
        bulletClass: "business-stack_progress_pill",
        bulletElement: "button",
        clickable: true,

        renderBullet: function (index, className) {
          return `
          <button type="button" class="${className}" aria-label="Go to slide ${index + 1}">
            <span class="business-stack_progress"></span>
          </button>
        `;
        }
      },

      on: {
        slideChangeTransitionStart(swiper) {
          swiper.pagination.bullets.forEach((bullet) => {
            const progress = bullet.querySelector(".business-stack_progress");
            if (progress) progress.style.width = "0%";
          });
        },

        autoplayTimeLeft(swiper, timeLeft, progress) {
          const activeBullet =
            swiper.pagination.bullets[swiper.realIndex];

          const activeProgress = activeBullet?.querySelector(
            ".business-stack_progress"
          );

          if (activeProgress) {
            activeProgress.style.width = `${(1 - progress) * 100}%`;
          }
        }
      }
    });
  });
}

/*--- Testimonial Slider ---*/
$(".f-checkout_component").each(function () {
  const component = this;

  const swiper = new Swiper($(component).find(".swiper")[0], {
    speed: 780,
    autoHeight: false,
    followFinger: true,
    freeMode: false,
    slideToClickedSlide: false,
    slidesPerView: 3,
    spaceBetween: 16,
    rewind: false,

    mousewheel: {
      forceToAxis: true
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true
    },

    breakpoints: {
      280: {
        slidesPerView: 1.04
      },

      768: {
        slidesPerView: 1.8
      },

      992: {
        slidesPerView: 3
      }
    },

    slideActiveClass: "is-active",
    slideDuplicateActiveClass: "is-active"
  });

  createTriangleProgress(
    swiper,
    component.querySelector(".slider-progress")
  );
});

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
