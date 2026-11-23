(() => {
  const BODY_CLASS = "ab--mm-redesign";
  const HOST_CLASS = "ab--mm-host";
  const TOP_CLASS = "ab--mm-top";
  const CURRENT_CLASS = "ab--mm-current";
  const BRANDS = {
    srixon: {
      menu: "#srixon-menu",
      tradeInBody: "Get credit toward new clubs",
      menus: {
        "balls-sx": { explore: { title: "Explore", fromHeaders: ["ball selector", "personalized balls"] } },
        "clubs-sx": {
          exploreColumn: "explore",
          exploreStatic: true,
          tradeIn: "trade-in program",
          tools: ["iron personalization", "iron selector", "zxi iron lineup", "iron combo set builder", "driver selector"],
        },
        "gear-sx": { layout: "center" },
        "sx-limited": { layout: "center", cta: () => "Shop Collection" },
        "fitting-sx": { layout: "fitting", exploreColumn: "events", noShopAll: true },
        "team-sx": { layout: "center", cta: (title) => (title.toLowerCase() === "video" ? "View Gallery" : "Learn More") },
        "sale-sx": { layout: "center", cta: (title) => `Shop ${title}` },
      },
      headerLabels: {
        "/srixon/balls/z-star-series": "Z-Star Series",
        "/srixon/balls/q-star-series": "Q-Star Series",
        "/srixon/balls/soft-feel-series": "Soft-Feel",
        "/srixon/gear/limited-edition": "Limited Editions",
        "/srixon/srixon-golf-driver-selector-fitting.html": "Selectors",
        "/srixon/events-sx.html": "Event",
      },
      shopAllLabels: {
        "/srixon/balls/z-star-series": "Shop All Z-STAR",
        "/srixon/balls/q-star-series": "Shop All Q-STAR",
        "/srixon/balls/soft-feel-series": "Shop All SOFT FEEL",
        "/srixon/clubs/fairway-woods": "Shop All Fairways",
        "/srixon/gear/limited-edition": "Shop All Limited Editions",
      },
    },
  };

  let BRAND = null;

  function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
    const elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
    if (timer <= 0) return;
    (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined")
      ? callback(elements)
      : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency, frequency), frequency);
  }

  const norm = (text) => (text || "").replace(/\s+/g, " ").trim();
  const key = (text) => norm(text).toLowerCase();
  const pathOf = (href) => {
    try {
      return new URL(href, location.origin).pathname.replace(/\/$/, "");
    } catch (e) {
      return href;
    }
  };

  function el(tag, className, attrs = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    Object.keys(attrs).forEach((name) => node.setAttribute(name, attrs[name]));
    [].concat(children).forEach((child) => {
      if (child == null) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  const link = (className, href, text, arrow) =>
    el("a", className, { href }, [el("span", "", {}, text), arrow ? el("span", "ab--mm__arrow", { "aria-hidden": "true" }, arrow) : null]);

  function parseColumns(host) {
    return [...host.querySelectorAll(":scope > .column > ul > li")]
      .map((li) => {
        const head = li.querySelector(":scope > a.menu-subhead");
        if (!head) return null;
        return {
          title: norm(head.textContent),
          href: head.getAttribute("href"),
          links: [...li.querySelectorAll(":scope > ul > li > a")].map((a) => ({
            text: norm(a.textContent),
            href: a.getAttribute("href"),
          })),
        };
      })
      .filter(Boolean);
  }

  function takeColumn(columns, title) {
    const index = columns.findIndex((col) => key(col.title) === title);
    return index > -1 ? columns.splice(index, 1)[0] : null;
  }

  function headerBlock(col, config) {
    const path = pathOf(col.href);
    const title = BRAND.headerLabels[path] || col.title;
    let ctaText = null;

    if (config.cta && !col.links.length) ctaText = config.cta(col.title);
    else if (!config.noShopAll) ctaText = BRAND.shopAllLabels[path] || `Shop All ${col.title}`;

    return el("div", "ab--mm__head", {}, [
      link("ab--mm__title", col.href, title),
      el("span", "ab--mm__accent", { "aria-hidden": "true" }),
      ctaText ? link("ab--mm__shop-all", col.href, ctaText, "→") : null,
    ]);
  }

  function categoryColumn(col, config) {
    const tools = config.tools || [];
    const series = col.links.filter((item) => !tools.includes(key(item.text)));
    const toolLinks = col.links.filter((item) => tools.includes(key(item.text)));
    const column = el("div", "ab--mm__col", {}, headerBlock(col, config));

    if (!col.links.length) {
      column.classList.add("ab--mm__col--head-only");
      return column;
    }

    column.appendChild(
      el("ul", "ab--mm__series", {}, series.map((item) => el("li", "", {}, link("ab--mm__series-link", item.href, item.text))))
    );

    if (toolLinks.length) {
      column.appendChild(
        el("div", "ab--mm__tools", {}, [
          el("span", "ab--mm__group-label", {}, "Tools & Fittings"),
          el("ul", "", {}, toolLinks.map((item) => el("li", "", {}, link("ab--mm__tool-link", item.href, item.text, "›")))),
        ])
      );
    }
    return column;
  }

  function explorePanel(title, href, links, tradeIn) {
    const titleNode = href ? link("ab--mm__title", href, title) : el("span", "ab--mm__title", {}, title);
    const panel = el("div", "ab--mm__explore", {}, [
      el("div", "ab--mm__explore-head", {}, [titleNode, el("span", "ab--mm__accent", { "aria-hidden": "true" })]),
      el("ul", "ab--mm__explore-links", {}, links.map((item) => el("li", "", {}, link("ab--mm__explore-link", item.href, item.text, "›")))),
    ]);

    if (tradeIn) {
      panel.appendChild(
        el("div", "ab--mm__trade-in", {}, [
          link("ab--mm__trade-in-title", tradeIn.href, tradeIn.title),
          el("p", "ab--mm__trade-in-body", {}, BRAND.tradeInBody),
          link("ab--mm__trade-in-link", tradeIn.href, "Learn More", "→"),
        ])
      );
    }
    return panel;
  }

  function buildMenu(id, host) {
    const config = BRAND.menus[id];
    const columns = parseColumns(host);
    if (!config || !columns.length) return null;

    let explore = null;

    if (config.explore) {
      const items = config.explore.fromHeaders
        .map((title) => takeColumn(columns, title))
        .filter(Boolean)
        .map((col) => ({ text: col.title, href: col.href }));
      if (items.length) explore = explorePanel(config.explore.title, null, items);
    }

    if (config.exploreColumn) {
      const exploreCol = takeColumn(columns, config.exploreColumn);
      const tradeIn = config.tradeIn ? takeColumn(columns, config.tradeIn) : null;
      if (exploreCol) {
        const title = BRAND.headerLabels[pathOf(exploreCol.href)] || exploreCol.title;
        explore = explorePanel(title, config.exploreStatic ? null : exploreCol.href, exploreCol.links, tradeIn);
      }
    }

    return el("div", `ab--mm ab--mm--${id} ab--mm--${config.layout || "default"}`, {}, [
      el("div", "ab--mm__cols", {}, columns.map((col) => categoryColumn(col, config))),
      explore,
    ]);
  }

  function markCurrentSection(item, topLink) {
    const href = pathOf(topLink.getAttribute("href"));
    const path = pathOf(location.pathname);
    if (href && (path === href || path.startsWith(`${href}/`))) item.classList.add(CURRENT_CLASS);
  }

  function init(items) {
    if (document.body.classList.contains(BODY_CLASS)) return;

    items.forEach((item) => {
      const topLink = item.querySelector(":scope > a.dropdown-link");
      const host = item.querySelector(":scope > .mega-menu.hidden-md-down");
      if (!topLink) return;

      item.classList.add(TOP_CLASS);
      markCurrentSection(item, topLink);
      if (!host || host.querySelector(".ab--mm")) return;

      const menu = buildMenu(topLink.id, host);
      if (!menu) return;
      host.appendChild(menu);
      host.classList.add(HOST_CLASS);
    });

    document.body.classList.add(BODY_CLASS, `ab--mm-brand-${BRAND.key}`);
  }

  function mainJs([body]) {
    const key = body.getAttribute("data-brand");
    if (!BRANDS[key]) return;
    BRAND = { key, ...BRANDS[key] };

    waitForElem(`${BRAND.menu} .brand-navigation-container > .column > ul > li.dropdown-item`, init);
  }

  waitForElem("body[data-brand]", mainJs);
})();
