(function () {
  "use strict";

  var practices = Array.isArray(window.PRACTICES) ? window.PRACTICES : [];
  var references = Array.isArray(window.REFERENCES) ? window.REFERENCES : [];

  // The three areas of the hub. Every entry's meta.json names one of these in
  // `section`; an entry without one belongs to the Practice Lab.
  var SECTIONS = [
    {
      id: "lab",
      name: "Practice Lab",
      href: "lab/index.html",
      blurb: "Drills for the maths and mechanics behind game code. You write the answer, the page draws it and tells you when it only works by accident."
    },
    {
      id: "blender",
      name: "Blender",
      href: "blender/index.html",
      blurb: "Notes on how things were built in Blender, node by node — what each piece does, why it is there, and when to use it."
    },
    {
      id: "unreal",
      name: "Unreal Engine",
      href: "unreal/index.html",
      blurb: "Look-up material for Unreal: where logic belongs, which class owns what, and the practices that drill it."
    }
  ];

  var body = document.body;
  var page = body.getAttribute("data-page") || "hub";
  // Section pages live one folder down, so every manifest href needs a prefix.
  var root = body.getAttribute("data-root") || "";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function link(href, cls, text) {
    var a = el("a", cls, text);
    a.href = href;
    return a;
  }

  function sectionOf(item) {
    return item.section || "lab";
  }

  function inSection(id) {
    return {
      practices: practices.filter(function (p) { return sectionOf(p) === id; }),
      references: references.filter(function (r) { return sectionOf(r) === id; })
    };
  }

  function plural(n, one, many) {
    return n + " " + (n === 1 ? one : many);
  }

  function countLine(set) {
    var parts = [];
    if (set.practices.length) parts.push(plural(set.practices.length, "practice", "practices"));
    if (set.references.length) parts.push(plural(set.references.length, "reference", "references"));
    return parts.length ? parts.join(" · ") : "nothing yet";
  }

  function topicsRow(item) {
    var topics = el("div", "topics");
    (item.topics || []).forEach(function (t) {
      topics.appendChild(el("span", null, t));
    });
    return topics;
  }

  function practiceCard(p, featured) {
    var card = el("article", featured ? "card newest" : "card");

    var top = el("div", "top");
    var h = el("h3");
    h.appendChild(link(root + p.href, null, p.title));
    top.appendChild(h);
    if (featured) top.appendChild(el("span", "badge", "latest"));
    top.appendChild(el("span", "when", p.added));
    card.appendChild(top);

    card.appendChild(el("p", null, p.summary));

    var why = el("p", "why");
    why.appendChild(el("b", null, "Why it exists"));
    why.appendChild(document.createTextNode(p.why));
    card.appendChild(why);

    var foot = el("div", "foot");
    foot.appendChild(topicsRow(p));
    foot.appendChild(link(root + p.href, "open", "Open practice"));
    card.appendChild(foot);
    return card;
  }

  function referenceRow(r) {
    var row = el("article", "ref");

    var top = el("div", "top");
    var h = el("h3");
    h.appendChild(link(root + r.href, null, r.title));
    top.appendChild(h);
    top.appendChild(el("span", "when", r.added));
    row.appendChild(top);

    row.appendChild(el("p", null, r.summary));

    var foot = el("div", "foot");
    foot.appendChild(topicsRow(r));
    foot.appendChild(link(root + r.href, "open", "Open reference"));
    row.appendChild(foot);
    return row;
  }

  function navList(items) {
    var ul = el("ul");
    items.forEach(function (item) {
      var li = el("li");
      li.appendChild(link(root + item.href, null, item.menu));
      ul.appendChild(li);
    });
    return ul;
  }

  /* ---------------- hub: one card per section ---------------- */

  function renderHub() {
    var nav = document.getElementById("nav");
    var grid = document.getElementById("sections");
    var recent = document.getElementById("recent");

    SECTIONS.forEach(function (s) {
      var set = inSection(s.id);

      var li = el("li");
      li.appendChild(link(root + s.href, null, s.name));
      nav.appendChild(li);

      var card = el("article", "seccard");
      card.setAttribute("data-section", s.id);

      var head = el("div", "top");
      var h = el("h3");
      h.appendChild(link(root + s.href, null, s.name));
      head.appendChild(h);
      head.appendChild(el("span", "when", countLine(set)));
      card.appendChild(head);

      card.appendChild(el("p", null, s.blurb));

      var items = set.practices.concat(set.references).sort(function (a, b) {
        return b.added.localeCompare(a.added);
      });
      if (items.length) {
        var list = el("ul", "latest");
        items.slice(0, 4).forEach(function (item) {
          var li2 = el("li");
          li2.appendChild(link(root + item.href, null, item.title));
          list.appendChild(li2);
        });
        card.appendChild(list);
      }

      card.appendChild(link(root + s.href, "open", "Open " + s.name));
      grid.appendChild(card);
    });

    var everything = practices.map(function (p) { return { item: p, kind: "practice" }; })
      .concat(references.map(function (r) { return { item: r, kind: "reference" }; }))
      .sort(function (a, b) { return b.item.added.localeCompare(a.item.added); });

    everything.slice(0, 6).forEach(function (e) {
      var s = SECTIONS.filter(function (x) { return x.id === sectionOf(e.item); })[0];
      var row = el("li");
      row.appendChild(el("span", "when", e.item.added));
      row.appendChild(link(root + e.item.href, "title", e.item.title));
      row.appendChild(el("span", "kind", (s ? s.name : "") + " · " + e.kind));
      recent.appendChild(row);
    });

    document.getElementById("count").textContent =
      plural(practices.length, "practice", "practices") + " · " +
      plural(references.length, "reference", "references");
  }

  /* ---------------- section page ---------------- */

  function renderSection(id) {
    var s = SECTIONS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    var set = inSection(id);

    // Practices from other sections that carry this section's topic, so the
    // Unreal page can point at the drills that exercise it.
    var related = id === "lab" ? [] : practices.filter(function (p) {
      return sectionOf(p) !== id && (p.topics || []).indexOf(id) !== -1;
    });

    var side = document.getElementById("sidenav");
    var cards = document.getElementById("cards");
    var refSection = document.getElementById("refs");
    var refList = document.getElementById("reflist");
    var relSection = document.getElementById("related");
    var relCards = document.getElementById("relcards");

    function sideGroup(title, items) {
      if (!items.length) return;
      side.appendChild(el("h2", "second", title));
      var nav = el("nav");
      nav.setAttribute("aria-label", title);
      nav.appendChild(navList(items));
      side.appendChild(nav);
    }

    sideGroup("Practices", set.practices);
    sideGroup("Reference", set.references);
    sideGroup("Related practices", related);

    var others = SECTIONS.filter(function (x) { return x.id !== id; });
    side.appendChild(el("h2", "second", "Other sections"));
    var onav = el("nav");
    onav.setAttribute("aria-label", "Other sections");
    var oul = el("ul");
    others.forEach(function (o) {
      var li = el("li");
      li.appendChild(link(root + o.href, null, o.name));
      oul.appendChild(li);
    });
    onav.appendChild(oul);
    side.appendChild(onav);

    set.practices.forEach(function (p, i) {
      cards.appendChild(practiceCard(p, i === 0));
    });
    cards.hidden = !set.practices.length;

    if (set.references.length) {
      refSection.hidden = false;
      set.references.forEach(function (r) { refList.appendChild(referenceRow(r)); });
    }

    if (related.length) {
      relSection.hidden = false;
      related.forEach(function (p) { relCards.appendChild(practiceCard(p, false)); });
    }

    if (!set.practices.length && !set.references.length) {
      var empty = el("div", "empty");
      empty.innerHTML = "Nothing in this section yet. Add a folder under <code>practices/</code> or " +
        "<code>references/</code> whose <code>meta.json</code> has <code>\"section\": \"" + id + "\"</code>, " +
        "then run <code>node tools/build-index.mjs</code>.";
      cards.parentNode.insertBefore(empty, cards);
    }

    document.getElementById("count").textContent = countLine(set);
  }

  if (page === "section") renderSection(body.getAttribute("data-section"));
  else renderHub();
})();
