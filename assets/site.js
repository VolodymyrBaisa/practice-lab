(function () {
  "use strict";

  var list = Array.isArray(window.PRACTICES) ? window.PRACTICES : [];
  var nav = document.getElementById("nav");
  var cards = document.getElementById("cards");
  var count = document.getElementById("count");

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  if (!list.length) {
    cards.appendChild(el("div", "empty")).innerHTML =
      "No practices indexed yet. Add a folder under <code>practices/</code> with a " +
      "<code>meta.json</code> and an <code>index.html</code>, then run " +
      "<code>node tools/build-index.mjs</code>.";
    count.textContent = "";
    return;
  }

  list.forEach(function (p, i) {
    var li = el("li");
    var a = el("a");
    a.href = p.href;
    if (i === 0) a.setAttribute("data-new", "true");
    a.textContent = p.menu;
    li.appendChild(a);
    nav.appendChild(li);

    var card = el("article", i === 0 ? "card newest" : "card");

    var top = el("div", "top");
    var h = el("h3");
    var link = el("a", null, p.title);
    link.href = p.href;
    h.appendChild(link);
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
    var open = el("a", "open", "Open practice");
    open.href = p.href;
    foot.appendChild(open);
    card.appendChild(foot);

    cards.appendChild(card);
  });

  count.textContent = list.length + (list.length === 1 ? " practice" : " practices");
})();
