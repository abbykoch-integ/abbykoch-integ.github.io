// Builds the page from content.yml. You shouldn't need to edit this file:
// all of the words live in content.yml.

(async function () {
  const app = document.getElementById('app');

  let data;
  try {
    const res = await fetch('content.yml', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Could not load content.yml (' + res.status + ')');
    data = jsyaml.load(await res.text());
  } catch (err) {
    // Shown only if content.yml has a typo, so it's easy to find and fix.
    app.innerHTML = '<div class="error"><h2>Something in content.yml needs a fix</h2>' +
      '<pre>' + esc(err.message) + '</pre>' +
      '<p>Most often it is a missing space after a dash, uneven indentation, or a colon ' +
      'inside text that needs "double quotes" around it. The line number above points to it.</p></div>';
    return;
  }

  const L = data.links || {};
  const img = f => 'images/' + encodeURI(f);

  app.innerHTML = [
    hero(data.hero || {}, L),
    data.looking_for ? `<section class="looking"><p>${md(data.looking_for)}</p></section>` : '',
    timeline(data.education, data.experience),
    (data.case_studies || []).map((c, i) => caseStudy(c, i)).join(''),
    practicums(data.practicums),
    skills(data.credentials, data.skills),
    involvement(data.involvement),
    contact(data.contact || {}, L, data.hero || {})
  ].join('');

  // ---------- sections ----------

  function hero(h, L) {
    return `
    <header class="hero" style="background-image:url('${img(h.background || '')}')">
      <div class="hero-card">
        <div class="hero-text">
          <h1>${esc(h.name)}</h1>
          <p class="creds">${(h.credentials || []).map(esc).join('<br>')}</p>
          <p class="label">${esc(h.label || '')}</p>
          <hr>
          ${(h.tagline || []).map(t => `<p class="tagline">${md(t)}</p>`).join('')}
          ${buttons(L, 'light')}
        </div>
        ${h.photo ? `<img class="headshot" src="${img(h.photo)}" alt="Portrait of ${esc(h.name)}">` : ''}
      </div>
    </header>`;
  }

  function buttons(L, tone) {
    const b = [];
    if (L.resume) b.push(`<a class="btn btn-${tone} primary" href="${encodeURI(L.resume)}" download>Download résumé</a>`);
    if (L.email) b.push(`<a class="btn btn-${tone}" href="mailto:${esc(L.email)}">Email me</a>`);
    if (L.linkedin) b.push(`<a class="btn btn-${tone}" href="${esc(L.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    return `<div class="buttons">${b.join('')}</div>`;
  }

  function timeline(edu, exp) {
    const col = (title, items, nameKey, roleKey) => `
      <div class="tl-col">
        <h2 class="section-title">${title}</h2>
        ${(items || []).map(e => `
          <div class="tl-item">
            <div class="tl-when">${esc(String(e.when ?? ''))}</div>
            <div>
              <h3 class="tl-org">${esc(e[nameKey])}</h3>
              <p class="tl-role">${esc(e[roleKey] || '')}</p>
              <p class="tl-desc">${md(e.description || '')}</p>
            </div>
          </div>`).join('')}
      </div>`;
    return `<section class="timeline wrap">
      ${col('Education', edu, 'school', 'credential')}
      ${col('Experience', exp, 'org', 'role')}
    </section>`;
  }

  function practicums(list) {
    if (!list || !list.length) return '';
    return `<section class="band light"><div class="wrap">
      <h2 class="section-title">Clinical Practicums</h2>
      <div class="cards">
        ${list.map(p => `<article class="card">
          <h3>${esc(p.place)}</h3>
          <p class="card-loc">${esc(p.location || '')}</p>
          <p>${md(p.description || '')}</p>
        </article>`).join('')}
      </div></div></section>`;
  }

  function skills(creds, groups) {
    if (!(creds || []).length && !(groups || []).length) return '';
    return `<section class="wrap skills">
      <h2 class="section-title">Credentials &amp; Skills</h2>
      <div class="creds-row">
        ${(creds || []).map(c => `<div class="cred"><strong>${esc(c.name)}</strong><span>${md(c.detail || '')}</span></div>`).join('')}
      </div>
      <div class="skill-groups">
        ${(groups || []).map(g => `<div class="skill-group">
          <h3>${esc(g.group)}</h3>
          <ul class="chips">${(g.items || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </section>`;
  }

  function caseStudy(c, i) {
    const tone = i % 2 === 0 ? 'dark' : 'grey';
    const block = (label, items) => items && items.length
      ? `<h4>${label}</h4><ul>${items.map(t => `<li>${md(t)}</li>`).join('')}</ul>` : '';
    const imgs = c.images || [];
    const stats = c.stats || [];
    // One or two photos sit beside the text; three or more get a full-width gallery below it.
    const wide = imgs.length >= 3;
    const gallery = imgs.length ? `<div class="gallery g${Math.min(imgs.length, 4)}">
      ${imgs.map(m => `<figure><img loading="lazy" src="${img(m.file)}" alt="${esc(m.alt || '')}">${
        m.caption ? `<figcaption>${md(m.caption)}</figcaption>` : ''}</figure>`).join('')}
    </div>` : '';
    return `
    <section class="case case-${tone}">
      <div class="wrap">
        ${c.featured ? '<span class="badge">Featured project</span>' : ''}
        <h2 class="case-title">${esc(c.title)}</h2>
        <p class="case-place">${esc(c.place || '')}</p>
        ${stats.length ? `<div class="stats">${stats.map(s =>
          `<div class="stat"><span class="num">${esc(String(s.number))}</span><span class="lbl">${esc(s.label)}</span></div>`).join('')}</div>` : ''}
        <div class="case-body ${wide ? 'wide' : imgs.length ? '' : 'no-img'}">
          <div class="pal">
            ${block('Problem', c.problem)}
            ${block('Approach', c.approach)}
            ${block('Learning', c.learning)}
          </div>
          ${wide ? '' : gallery}
        </div>
        ${wide ? gallery : ''}
      </div>
    </section>`;
  }

  function involvement(list) {
    if (!list || !list.length) return '';
    return `<section class="wrap involvement">
      <h2 class="section-title">Conferences &amp; Community</h2>
      <ul>${list.map(x => `<li>
        <span class="tl-when">${esc(String(x.when ?? ''))}</span>
        <div><h3 class="tl-org">${esc(x.title)}</h3><p class="tl-desc">${md(x.detail || '')}</p></div>
      </li>`).join('')}</ul>
    </section>`;
  }

  function contact(c, L, h) {
    return `<footer class="contact">
      <div class="wrap">
        <h2>${esc(c.heading || 'Reach out!')}</h2>
        ${c.text ? `<p>${md(c.text)}</p>` : ''}
        <p class="contact-lines">
          <strong>${esc(h.name || '')}</strong><br>
          ${L.email ? `<a href="mailto:${esc(L.email)}">${esc(L.email)}</a><br>` : ''}
          ${L.linkedin ? `<a href="${esc(L.linkedin)}" target="_blank" rel="noopener">${esc(L.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>` : ''}
        </p>
        ${buttons(L, 'light')}
      </div>
    </footer>`;
  }

  // ---------- helpers ----------

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, ch =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  // Escapes the text, then turns **bold** into bold.
  function md(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
})();
