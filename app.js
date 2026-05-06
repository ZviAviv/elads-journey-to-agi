// Elad's Journey to GAI — site behavior
// Sidebar highlight, prev/next keyboard, glossary search, progress bar.

(function () {
  'use strict';

  const SECTIONS = [
    { num: '00', slug: 'index',                  title: 'Start here',                              part: 0, file: 'index.html' },
    { num: '01', slug: '01-what-is-an-agent',    title: "What's an agent?",                       part: 1 },
    { num: '02', slug: '02-code-vs-cowork-vs-chat', title: 'Claude Code vs Cowork vs Chat',       part: 1 },
    { num: '03', slug: '03-your-first-prompt',   title: 'Your first prompt',                       part: 2 },
    { num: '04', slug: '04-tokens-and-memory',   title: 'Tokens & memory',                         part: 2 },
    { num: '05', slug: '05-modes',               title: 'Modes',                                   part: 2 },
    { num: '06', slug: '06-models',              title: 'Models',                                  part: 2 },
    { num: '07', slug: '07-skills',              title: 'Skills',                                  part: 3 },
    { num: '08', slug: '08-slash-commands',      title: 'Slash commands',                          part: 3 },
    { num: '09', slug: '09-plugins',             title: 'Plugins',                                 part: 3 },
    { num: '10', slug: '10-sessions',            title: 'Sessions & parallel work',                part: 4 },
    { num: '11', slug: '11-permissions',         title: 'Permissions & settings',                  part: 4 },
    { num: '12', slug: '12-git-worktrees',       title: 'Git basics for agents',                   part: 4 },
    { num: '13', slug: '13-subagents',           title: 'Subagents',                               part: 4 },
    { num: '14', slug: '14-mcp',                 title: 'MCP',                                     part: 4 },
    { num: '15', slug: '15-hooks',               title: 'Hooks',                                   part: 4 },
    { num: '16', slug: '16-claude-design',       title: 'Claude Design vs Claude Code',            part: 4 },
    { num: 'G',  slug: 'glossary',               title: 'Glossary',                                part: 5, file: 'glossary.html' },
    { num: 'T',  slug: 'tips',                   title: 'Tips & best practices',                   part: 5, file: 'tips.html' }
  ];

  const PARTS = {
    0: { num: '0', title: 'Start' },
    1: { num: '1', title: 'The Frame' },
    2: { num: '2', title: 'The Engine' },
    3: { num: '3', title: 'The Toolkit' },
    4: { num: '4', title: 'Going Further' },
    5: { num: '5', title: 'Reference' }
  };

  function fileFor(section) {
    if (section.file) return section.file;
    return 'modules/' + section.slug + '.html';
  }

  function currentSlug() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'index.html' || path === '') return 'index';
    if (path === 'glossary.html') return 'glossary';
    if (path === 'tips.html') return 'tips';
    return path.replace(/\.html$/, '');
  }

  function buildSidebar() {
    const slug = currentSlug();
    const sidebar = document.querySelector('[data-sidebar-nav]');
    if (!sidebar) return;

    const inModule = window.location.pathname.indexOf('/modules/') !== -1;
    const resolveHref = (s) => {
      if (inModule) return s.file ? '../' + s.file : s.slug + '.html';
      return s.file ? s.file : 'modules/' + s.slug + '.html';
    };

    const groups = {};
    SECTIONS.forEach((s) => {
      if (!groups[s.part]) groups[s.part] = [];
      groups[s.part].push(s);
    });

    const partsHTML = Object.keys(groups).map((p) => {
      const part = PARTS[p];
      const items = groups[p].map((s) => {
        const isCurrent = s.slug === slug;
        return `<li data-slug="${s.slug}">
          <a href="${resolveHref(s)}" class="${isCurrent ? 'current' : ''}">
            <span class="nav-num">${s.num}</span><span>${s.title}</span>
          </a>
        </li>`;
      }).join('');
      return `
        <div class="nav-part">
          <div class="nav-part-label"><span class="num">PT ${part.num}</span><span>${part.title}</span></div>
          <ul class="nav-list">${items}</ul>
        </div>`;
    }).join('');

    sidebar.innerHTML = partsHTML;
  }

  function buildPager() {
    const slug = currentSlug();
    const pager = document.querySelector('[data-pager]');
    if (!pager) return;

    const idx = SECTIONS.findIndex((s) => s.slug === slug);
    if (idx === -1) return;

    const inModule = window.location.pathname.indexOf('/modules/') !== -1;
    const resolveHref = (s) => {
      if (inModule) return s.file ? '../' + s.file : s.slug + '.html';
      return s.file ? s.file : 'modules/' + s.slug + '.html';
    };

    const prev = SECTIONS[idx - 1];
    const next = SECTIONS[idx + 1];

    let html = '';
    if (prev) {
      html += `<a class="pager-prev" href="${resolveHref(prev)}" data-pager-prev>
        <span class="pager-label">← ${prev.num} Previous</span>
        <span class="pager-title">${prev.title}</span>
      </a>`;
    } else {
      html += `<span class="pager-empty"></span>`;
    }
    if (next) {
      html += `<a class="pager-next" href="${resolveHref(next)}" data-pager-next>
        <span class="pager-label">${next.num} Next →</span>
        <span class="pager-title">${next.title}</span>
      </a>`;
    } else {
      html += `<span class="pager-empty"></span>`;
    }
    pager.innerHTML = html;
  }

  function bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Ignore when typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') document.activeElement.blur();
        return;
      }

      if (e.key === 'ArrowRight') {
        const next = document.querySelector('[data-pager-next]');
        if (next) window.location.href = next.href;
      } else if (e.key === 'ArrowLeft') {
        const prev = document.querySelector('[data-pager-prev]');
        if (prev) window.location.href = prev.href;
      } else if (e.key === '/') {
        const search = document.getElementById('search');
        if (search) {
          e.preventDefault();
          search.focus();
        }
      }
    });
  }

  function bindProgress() {
    const bar = document.querySelector('.progress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      bar.style.width = pct + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function bindSidebarToggle() {
    const btn = document.querySelector('.sidebar-toggle');
    const body = document.querySelector('.sidebar-body');
    if (!btn || !body) return;
    btn.addEventListener('click', () => {
      body.classList.toggle('collapsed');
    });
    // Default collapsed on mobile
    if (window.matchMedia('(max-width: 900px)').matches) {
      body.classList.add('collapsed');
    }
  }

  function bindSearch() {
    const search = document.getElementById('search');
    if (!search) return;
    const items = document.querySelectorAll('[data-search-item]');
    const noResults = document.querySelector('[data-no-results]');

    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      items.forEach((el) => {
        const text = (el.textContent || '').toLowerCase();
        const match = q === '' || text.includes(q);
        el.classList.toggle('hidden', !match);
        if (match) visible++;
      });
      if (noResults) noResults.style.display = visible === 0 && q !== '' ? 'block' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    buildPager();
    bindKeyboard();
    bindProgress();
    bindSidebarToggle();
    bindSearch();
  });
})();
