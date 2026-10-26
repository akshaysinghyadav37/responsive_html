"use strict";
/* ===== सेटिंग (केवल यहीं बदलें) ===== */
const CONFIG = {
  goatCounterCode: "",   // GoatCounter खाते का कोड, जैसे "yadav-vivah" (README देखें)
  year: null,            // विवाह का वर्ष, जैसे 2026 — तय होने पर ही भरें; खाली रहने पर कैलेंडर बंद रहेगा
  mapsQuery: "बाफना मंगलम, दुर्ग",  // सही Google Maps लिंक मिलने पर mapsUrl भरें
  mapsUrl: "",
  audio: ""              // जैसे "shubh.mp3" — खाली रहने पर ध्वनि बटन छिपा रहेगा
};
/* ===== सारी सामग्री (नाम/वर्तनी यहीं सुधारें) ===== */
const DATA = {
  couples: [
    { id: "akshay", menu: "💍 अक्षय एवं लीना का विवाह", title: "प्रथम शुभ विवाह",
      groom: { name: "चि. अक्षय", father: "श्री आदेश्वर यादव", village: "खेरूद" },
      bride: { name: "आयुष्मती लीना", father: "श्री रोहित यादव", village: "बोथा" },
      events: [["1 दिसंबर — चूलमाटी एवं चिकट", ["स्थान: खेरूद"]],
               ["2 दिसंबर — बारात प्रस्थान एवं विवाह", ["बारात प्रस्थान: खेरूद से", "विवाह: मांगलिक बेला में"]]] },
    { id: "aditya", menu: "💍 आदित्य एवं रेनू का विवाह", title: "द्वितीय शुभ विवाह",
      groom: { name: "चि. आदित्य", father: "श्री आदेश्वर यादव", village: "खेरूद" },
      bride: { name: "आयुष्मती रेनू", father: "स्वर्गीय श्री गिरधर यादव", village: "पितई बांध" },
      events: [["3 दिसंबर — चूलमाटी एवं चिकट", ["स्थान: खेरूद"]],
               ["4 दिसंबर — बारात प्रस्थान एवं विवाह", ["बारात प्रस्थान: खेरूद से", "विवाह: मांगलिक बेला में"]]] }
  ],
  samaroh: { menu: "🌺 सामूहिक आशीर्वाद समारोह", date: "5 दिसंबर", place: "बाफना मंगलम, दुर्ग", time: "सायं 7:00 बजे से" },
  /* परिवार: जानकारी मिलने पर items में {name, role} जोड़ें; शाखाओं के लिए children भी दे सकते हैं */
  family: [
    { title: "बड़े पापा एवं चाचा", items: [] },
    { title: "बुआ परिवार", items: [] },
    { title: "मामा परिवार", items: [] },
    { title: "स्वर्ग से आशीर्वाद", heaven: true, items: [] },
    { title: "दादा-दादी एवं माता-पिता", items: [
      { name: "श्री कल्याण सिंह यादव", role: "दादाजी", children: [
        { name: "श्री आदेश्वर यादव", role: "पिताजी", spouse: { name: "श्रीमती केशर देवी", role: "माताजी" }, children: [
          { name: "चि. अक्षय", role: "सुपुत्र" }, { name: "चि. आदित्य", role: "सुपुत्र" } ] } ] } ] },
    { title: "समस्त यादव परिवार", all: true, items: [] }
  ],
  ashirvad: ["श्री सनक कुमार", "श्री दीपक कुमार", "श्री बृजभूषण", "श्री गोविंद यादव", "श्री सतीश यादव", "श्री चंद्रशेखर यादव", "श्री घनश्याम (मनहरण)", "समस्त यादव परिवार"],
  vineet: ["श्री कल्याण सिंह यादव — दादाजी", "श्रीमती केशर देवी — माताजी", "श्री आदेश्वर यादव — पिताजी"]
};

/* ===== सहायक ===== */
const $ = (s) => document.querySelector(s);
function h(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  (kids || []).forEach((k) => e.appendChild(k));
  return e;
}
function btn(text, cls, fn) { const b = h("button", cls, text); b.type = "button"; b.addEventListener("click", fn); return b; }
const shareUrl = () => location.href.split("#")[0];
const go = (route) => { location.hash = "#/" + route; };

/* ===== पैनल बनाना ===== */
function person(label, p, rel) {
  return h("div", "person", "", [h("small", "", label), h("b", "", p.name), h("span", "", rel + " " + p.father), h("span", "", "ग्राम — " + p.village)].map((x, i) => (i === 3 ? h("div", "", "", [x]) : x)));
}
function couplePanel(c) {
  const tl = h("ul", "timeline");
  c.events.forEach(([t, lines]) => tl.appendChild(h("li", "", "", [h("b", "", t)].concat(lines.map((l) => h("div", "", l))))));
  return panelWrap(c.id, [h("h2", "", c.title), person("वर", c.groom, "सुपुत्र"), person("वधू", c.bride, c.bride.father.startsWith("स्वर्गीय") ? "सुपुत्री" : "सुपुत्री"), tl,
    h("div", "actions", "", [btn("▲ कार्यक्रम बंद करें", "btn", () => go("menu"))])]);
}
function panelWrap(id, kids) { const s = h("section", "panel"); s.id = "p-" + id; s.hidden = true; kids.forEach((k) => s.appendChild(k)); return s; }

function sarohPanel() {
  const d = DATA.samaroh, st = h("p", "status");
  st.setAttribute("role", "status");
  const maps = btn("📍 रास्ता देखें", "btn", () => {
    const u = CONFIG.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
    window.open(u, "_blank", "noopener");
  });
  const cal = btn("📅 तारीख याद रखें", "btn", () => {
    if (!CONFIG.year) { st.textContent = "कैलेंडर सुविधा विवाह का वर्ष तय होने पर चालू होगी।"; return; }
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Yadav Nimantran//HI", "BEGIN:VEVENT", "UID:ashirvad-" + CONFIG.year + "@nimantran",
      "DTSTAMP:" + CONFIG.year + "1201T000000Z", "DTSTART:" + CONFIG.year + "1205T190000", "SUMMARY:सामूहिक आशीर्वाद समारोह", "LOCATION:" + d.place, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = h("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" })); a.download = "ashirvad-samaroh.ics"; a.click();
    st.textContent = "कैलेंडर फ़ाइल डाउनलोड हो गई।";
  });
  const share = btn("↗ निमंत्रण साझा करें", "btn", async () => {
    const data = { title: "शुभ विवाह निमंत्रण", text: "यादव परिवार का शुभ विवाह निमंत्रण", url: shareUrl() };
    try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(data.url); st.textContent = "लिंक कॉपी हो गया।"; } catch (e) { st.textContent = "लिंक: " + data.url; }
  });
  const wa = btn("WhatsApp पर भेजें", "btn", () => window.open("https://wa.me/?text=" + encodeURIComponent("शुभ विवाह निमंत्रण — यादव परिवार\n" + shareUrl()), "_blank", "noopener"));
  return panelWrap("samaroh", [h("h2", "", "🌸 सामूहिक आशीर्वाद समारोह 🌸"), h("p", "person", "", [h("b", "", d.date)]),
    h("p", "person", "दोनों नवविवाहित जोड़ों के स्वागत एवं सम्मान में"), h("p", "person", "", [h("b", "", "स्थान: " + d.place), h("b", "", "समय: " + d.time)]),
    h("p", "soft", "आपकी गरिमामयी उपस्थिति हमारे लिए हर्ष एवं सौभाग्य का विषय होगी। सपरिवार पधारकर नवदंपतियों को अपना स्नेह एवं आशीर्वाद प्रदान करें।"),
    h("div", "actions", "", [maps, cal, share, wa]), st, h("div", "actions", "", [btn("बंद करें", "btn", () => go("menu"))])]);
}

function treeList(items) {
  const ul = h("ul", "tree");
  items.forEach((n) => {
    const li = h("li", "", "", [h("span", "node", "", [h("span", "", n.name), n.role ? h("small", "", n.role) : h("span")])]);
    if (n.spouse) li.appendChild(h("div", "", "", [h("span", "node", "", [h("span", "", n.spouse.name), h("small", "", n.spouse.role + " (धर्मपत्नी)")])]));
    if (n.children && n.children.length) li.appendChild(treeList(n.children));
    ul.appendChild(li);
  });
  return ul;
}
function familyPanel() {
  const wrap = [h("h2", "", "👨‍👩‍👧‍👦 हमारा परिवार")], accs = [];
  DATA.family.forEach((cat, i) => {
    const body = h("div", "body"); body.id = "f" + i; body.hidden = true;
    if (cat.heaven) body.appendChild(h("p", "soft", "हमारे वे सभी प्रियजन, जो आज हमारे बीच उपस्थित नहीं हैं, उनकी स्मृतियाँ और आशीर्वाद सदैव हमारे साथ हैं। 🪷"));
    if (cat.all) { body.appendChild(h("p", "person", "", [h("b", "", "सप्रेम — समस्त यादव परिवार"), h("span", "", "ग्राम — खेरूद")])); body.appendChild(h("p", "soft", "हमारे परिवार की ओर से आप सभी का हार्दिक स्वागत एवं अभिनंदन।")); }
    if (cat.items.length) body.appendChild(treeList(cat.items));
    else if (!cat.all) body.appendChild(h("p", "soft", "नाम एवं विवरण परिवार द्वारा शीघ्र जोड़े जाएँगे।"));
    const b = h("button", "", "", [h("span", "", cat.title), h("span", "", "▼")]);
    b.type = "button"; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", body.id);
    b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") === "true";
      accs.forEach(([bb, bd]) => { bb.setAttribute("aria-expanded", "false"); bb.lastChild.textContent = "▼"; bd.hidden = true; });
      if (!open) { b.setAttribute("aria-expanded", "true"); b.lastChild.textContent = "▲"; body.hidden = false; }
    });
    accs.push([b, body]);
    wrap.push(h("div", "acc" + (cat.heaven ? " heaven" : ""), "", [b, body]));
  });
  wrap.push(h("div", "actions", "", [btn("बंद करें", "btn", () => go("menu"))]));
  return panelWrap("parivar", wrap);
}

/* ===== रूटिंग (Back बटन के लिए hash का उपयोग) ===== */
const IDS = ["akshay", "aditya", "samaroh", "parivar"];
function route() {
  const r = location.hash.replace("#/", "");
  const main = $("#main"), welcome = $("#welcome");
  if (!r) { main.hidden = true; welcome.hidden = false; window.scrollTo(0, 0); syncMenu(null); return; }
  main.hidden = false;
  const id = IDS.includes(r) ? r : null;
  syncMenu(id);
  (id ? $("#p-" + id) : $("#menu")).scrollIntoView({ behavior: "smooth", block: "start" });
}
function syncMenu(id) {
  document.querySelectorAll("#menu button").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.id === id)));
  document.querySelectorAll(".panel").forEach((p) => { p.hidden = p.id !== "p-" + id; });
}

/* ===== आगंतुक संख्या (GoatCounter) ===== */
function counter() {
  const el = $("#counter"), code = CONFIG.goatCounterCode;
  if (!code) { el.textContent = "आगंतुक संख्या अभी उपलब्ध नहीं है"; return; }
  const s = h("script"); s.async = true; s.src = "//gc.zgo.at/count.js"; s.dataset.goatcounter = "https://" + code + ".goatcounter.com/count";
  s.onload = () => setTimeout(() => {
    fetch("https://" + code + ".goatcounter.com/counter/TOTAL.json").then((r) => { if (!r.ok) throw 0; return r.json(); })
      .then((j) => { el.textContent = "👣 अब तक इस निमंत्रण को देखने वाले: " + j.count; })
      .catch(() => { el.textContent = "आगंतुक संख्या अभी उपलब्ध नहीं है"; });
  }, 1500);
  s.onerror = () => { el.textContent = "आगंतुक संख्या अभी उपलब्ध नहीं है"; };
  document.head.appendChild(s);
}

/* ===== शुरुआत ===== */
function init() {
  const menu = $("#menu"), panels = $("#panels");
  const items = [[DATA.couples[0].id, DATA.couples[0].menu], [DATA.couples[1].id, DATA.couples[1].menu], ["samaroh", DATA.samaroh.menu], ["parivar", "👨‍👩‍👧‍👦 हमारा परिवार"]];
  items.forEach(([id, label]) => { const b = btn(label, "", () => go(b.getAttribute("aria-expanded") === "true" ? "menu" : id)); b.dataset.id = id; b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-controls", "p-" + id); menu.appendChild(b); });
  DATA.couples.forEach((c) => panels.appendChild(couplePanel(c)));
  panels.appendChild(sarohPanel()); panels.appendChild(familyPanel());
  DATA.ashirvad.forEach((n) => $("#ashList").appendChild(h("li", "", n)));
  DATA.vineet.forEach((n) => $("#vinitList").appendChild(h("li", "", n)));
  $("#openBtn").addEventListener("click", () => go("menu"));
  $("#homeBtn").addEventListener("click", () => { history.pushState(null, "", shareUrl()); route(); });
  window.addEventListener("hashchange", route); window.addEventListener("popstate", route);
  route();
  // ऊपर जाएँ
  const top = $("#topBtn"); top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => { top.hidden = window.scrollY < 500; }, { passive: true });
  // पंखुड़ियाँ
  const pb = $("#petalBtn"), box = $("#petals"); let on = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = () => {
    box.textContent = "";
    if (on) for (let i = 0; i < 12; i++) { const p = h("i", "petal"); p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s`; box.appendChild(p); }
    pb.textContent = on ? "🌼 पंखुड़ियाँ बंद करें" : "🌼 पंखुड़ियाँ चालू करें"; pb.setAttribute("aria-pressed", String(on));
  };
  pb.addEventListener("click", () => { on = !on; draw(); }); draw();
  // शुभ ध्वनि (केवल क्लिक के बाद)
  if (CONFIG.audio) {
    const sb = $("#soundBtn"); let au = null; sb.hidden = false;
    sb.addEventListener("click", () => {
      if (!au) { au = new Audio(CONFIG.audio); au.loop = true; }
      if (au.paused) { au.play().catch(() => {}); sb.textContent = "🔔 ध्वनि बंद करें"; sb.setAttribute("aria-pressed", "true"); }
      else { au.pause(); sb.textContent = "🔔 शुभ ध्वनि चलाएँ"; sb.setAttribute("aria-pressed", "false"); }
    });
  }
  counter();
}
init();
