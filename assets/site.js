(function () {
  "use strict";

  var practices = Array.isArray(window.PRACTICES) ? window.PRACTICES : [];
  var references = Array.isArray(window.REFERENCES) ? window.REFERENCES : [];

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

  /* ---------------- practices: sidebar + cards ---------------- */

  var nav = document.getElementById("nav");
  var cards = document.getElementById("cards");

  if (!practices.length) {
    cards.appendChild(el("div", "empty")).innerHTML =
      "No practices indexed yet. Add a folder under <code>practices/</code> with a " +
      "<code>meta.json</code> and an <code>index.html</code>, then run " +
      "<code>node tools/build-index.mjs</code>.";
  }

  practices.forEach(function (p, i) {
    var li = el("li");
    var a = link(p.href, null, p.menu);
    if (i === 0) a.setAttribute("data-new", "true");
    li.appendChild(a);
    nav.appendChild(li);

    var card = el("article", i === 0 ? "card newest" : "card");

    var top = el("div", "top");
    var h = el("h3");
    h.appendChild(link(p.href, null, p.title));
    top.appendChild(h);
    if (i === 0) top.appendChild(el("span", "badge", "latest"));
    top.appendChild(el("span", "when", p.added));
    card.appendChild(top);

    card.appendChild(el("p", null, p.summary));

    var why = el("p", "why");
    why.appendChild(el("b", null, "Why it exists"));
    why.appendChild(document.createTextNode(p.why));
    card.appendChild(why);

    var foot = el("div", "foot");
    var topics = el("div", "topics");
    (p.topics || []).forEach(function (t) {
      topics.appendChild(el("span", null, t));
    });
    foot.appendChild(topics);
    foot.appendChild(link(p.href, "open", "Open practice"));
    card.appendChild(foot);

    cards.appendChild(card);
  });

  /* ---------------- references: sidebar + list ---------------- */

  var refNav = document.getElementById("refnav");
  var refSection = document.getElementById("refs");
  var refList = document.getElementById("reflist");
  var refHeads = document.querySelectorAll("[data-ref-head]");

  if (references.length) {
    refSection.hidden = false;
    Array.prototype.forEach.call(refHeads, function (n) { n.hidden = false; });

    references.forEach(function (r) {
      var li = el("li");
      li.appendChild(link(r.href, null, r.menu));
      refNav.appendChild(li);

      var row = el("article", "ref");

      var top = el("div", "top");
      var h = el("h3");
      h.appendChild(link(r.href, null, r.title));
      top.appendChild(h);
      top.appendChild(el("span", "when", r.added));
      row.appendChild(top);

      row.appendChild(el("p", null, r.summary));

      var foot = el("div", "foot");
      var topics = el("div", "topics");
      (r.topics || []).forEach(function (t) {
        topics.appendChild(el("span", null, t));
      });
      foot.appendChild(topics);
      foot.appendChild(link(r.href, "open", "Open reference"));
      row.appendChild(foot);

      refList.appendChild(row);
    });
  }

  /* ---------------- count ---------------- */

  var parts = [];
  if (practices.length) parts.push(practices.length + (practices.length === 1 ? " practice" : " practices"));
  if (references.length) parts.push(references.length + (references.length === 1 ? " reference" : " references"));
  document.getElementById("count").textContent = parts.join(" · ");
})();
