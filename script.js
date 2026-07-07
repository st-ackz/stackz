(function () {
  'use strict';

  // --- Reveal screen ---
  const reveal = document.getElementById('revealScreen');
  const profile = document.getElementById('profile');
  if (reveal) {
    reveal.addEventListener('click', () => {
      reveal.classList.add('hidden');
    });
  }

  // --- Year ---
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // --- Discord profile card (manual config + optional Lanyard live data) ---
  // Set these manually (always shown):
  var dcConfig = {
    displayName: 'stackz',     // your display/name
    username: 'c9a7',        // without @
    avatar: '05ea87710d57a2018662052b9e4572fa.jpg', // image path or Discord CDN URL
    bio: '',                     // optional bio text
    status: 'online',            // online / idle / dnd / offline
  };

  // Set your Discord user ID here for LIVE data from Lanyard (requires joining their server)
  var discordUserId = '791502710922936341';

  var dcDisplayName = document.getElementById('dcDisplayName');
  var dcStatusEl = document.getElementById('dcStatus');
  var dcBio = document.getElementById('dcBio');
  var dcAvatar = document.getElementById('dcAvatar');
  var dcStatusRing = document.getElementById('dcStatusRing');

  function applyDiscordProfile(overrides) {
    var name = overrides.displayName || dcConfig.displayName;
    var user = overrides.username || dcConfig.username;
    var avatar = overrides.avatar || dcConfig.avatar;
    var bio = overrides.bio !== undefined ? overrides.bio : dcConfig.bio;
    var status = overrides.status || dcConfig.status;

    if (dcDisplayName) dcDisplayName.textContent = name;
    if (dcBio) {
      dcBio.textContent = bio;
      dcBio.style.display = bio ? 'block' : 'none';
    }
    if (dcAvatar && avatar) dcAvatar.src = avatar;

    if (dcStatusEl) {
      var dot = dcStatusEl.querySelector('.dc-status-dot');
      var text = dcStatusEl.querySelector('.dc-status-text');
      if (text) text.textContent = status === 'dnd' ? 'do not disturb' : status;
      var statusColor = '#22c55e';
      if (status === 'idle') statusColor = '#f0b232';
      else if (status === 'dnd') statusColor = '#ed4245';
      else if (status === 'offline') statusColor = 'rgba(255,255,255,0.3)';
      if (dot) dot.style.background = statusColor;
      if (text) text.style.color = statusColor;
      if (dcStatusRing) dcStatusRing.style.borderColor = statusColor;
    }
  }

  // Apply static config immediately
  applyDiscordProfile({});

  // Try Lanyard for live data (optional — requires joining https://discord.gg/lanyard)
  if (discordUserId) {
    fetch('https://api.lanyard.rest/v1/users/' + discordUserId)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.success || !data.data) return;
        var d = data.data;
        var user = d.discord_user;
        var ext = user.avatar && user.avatar.startsWith('a_') ? 'gif' : 'png';
        applyDiscordProfile({
          displayName: user.display_name || user.global_name || user.username,
          username: user.username,
          avatar: user.avatar ? 'https://cdn.discordapp.com/avatars/' + discordUserId + '/' + user.avatar + '.' + ext : null,
          bio: user.bio || '',
          status: d.discord_status || 'offline',
        });
      })
      .catch(function () {});
  }

  // Typewriter effect (replaces username line)
  var typewriterEl = document.getElementById('typewriterText');
  var typewriterTexts = ['certified skid', 'stacked', '~ for surprise'];
  var typewriterIndex = 0;
  var charIndex = 0;
  var isDeleting = false;

  function typewriterTick() {
    if (!typewriterEl) return;
    var current = typewriterTexts[typewriterIndex];
    if (isDeleting) {
      charIndex--;
      typewriterEl.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        typewriterIndex = (typewriterIndex + 1) % typewriterTexts.length;
        setTimeout(typewriterTick, 400);
        return;
      }
      setTimeout(typewriterTick, 40 + Math.random() * 30);
    } else {
      charIndex++;
      typewriterEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typewriterTick, 2000);
        return;
      }
      setTimeout(typewriterTick, 80 + Math.random() * 70);
    }
  }
  typewriterTick();

  // --- Firebase global view counter ---
  var firebaseConfig = {
    apiKey: "AIzaSyDujpU23H2zWBynogF2XQ52z6KENQPl010",
    authDomain: "portfolio-7b0d3.firebaseapp.com",
    projectId: "portfolio-7b0d3",
    storageBucket: "portfolio-7b0d3.firebasestorage.app",
    messagingSenderId: "939573899268",
    appId: "1:939573899268:web:f3a7569c6d165b534c4551",
    measurementId: "G-WC2KHFNF1M"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  var viewEl = document.getElementById('viewCount');
  var viewRef = db.collection('counters').doc('views');

  db.runTransaction(function (transaction) {
    return transaction.get(viewRef).then(function (doc) {
      var count = (doc.exists ? doc.data().count : -1) + 1;
      transaction.set(viewRef, { count: count }, { merge: true });
      return count;
    });
  }).then(function (count) {
    if (viewEl) {
      viewEl.textContent = count < 1000 ? count : (count / 1000).toFixed(1) + 'k';
    }
  }).catch(function () {
    if (viewEl) viewEl.textContent = '500';
  });

  // --- Particles ---
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const pc = Math.min(50, Math.floor((w * h) / 20000));

    for (let i = 0; i < pc; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.3 + 0.05,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // --- UID display ---
  const uidEl = document.getElementById('uidDisplay');
  if (uidEl) {
    uidEl.textContent = '158';
  }

  // --- Badges (fakecrime-style SVG icons) ---
  const badgesEl = document.getElementById('badges');
  if (badgesEl) {
    const badges = [
      {
        label: 'Verified',
        svg: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      },
      {
        label: 'Premium',
        svg: '<svg viewBox="0 0 1200 1200"><path d="M808.402,377L600,176.734L391.598,377H808.402z M1150,377l-143.602-195.442L870.837,377H1150z M564.714,171H221.035l137.453,198.185L564.714,171z M978.964,171H635.286l206.226,198.185L978.964,171z M376.462,405L600,1028.787L823.538,405H376.462z M193.602,181.558L50,377h279.163L193.602,181.558z M639.732,1002.205L1147.352,405H853.715L639.732,1002.205z M52.648,405l507.714,597.3L346.285,405H52.648z"/></svg>',
      },
      {
        label: 'Developer',
        svg: '<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H4V6h16v12zM6.42 8.29L10.13 12l-3.71 3.71-1.42-1.42L7.29 12 5 9.71l1.42-1.42zm7.58 5.71h-4v-2h4v2z"/></svg>',
      },
    ];
    badgesEl.innerHTML = badges
      .map((b) => `<span class="badge">${b.svg}${b.label}</span>`)
      .join('');
  }

  // --- Plate ---
  const plateEl = document.getElementById('plate');
  if (plateEl) {
    const items = [
      
      { label: 'Joined', value: '6 months ago' },
    ];
    plateEl.innerHTML = items
      .map(
        (item) =>
          `<span class="plate-item">
            <span class="plate-label">${item.label}</span>
            <span class="plate-value${item.accent ? ' accent' : ''}">${item.value}</span>
          </span>`
      )
      .join('');
  }

  // --- Platform icon links (Discord, Roblox, Steam, GitHub) ---
  const platEl = document.getElementById('platformLinks');
  if (platEl) {
    const platforms = [
      {
        url: 'https://discord.com/users/791502710922936341',
        svg: '<svg viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>',
      },
      {
        url: 'https://www.roblox.com/users/1672910853/profile',
        svg: '<svg viewBox="0 0 24 24"><path d="M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453z"/></svg>',
      },
      {
        url: 'https://steamcommunity.com/profiles/76561199376199654/',
        svg: '<svg viewBox="0 0 24 24"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg>',
      },
      {
        url: 'https://github.com/st-ackz',
        svg: '<svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
      },
    ];
    platEl.innerHTML = platforms
      .map((p) => `<a href="${p.url}" class="platform-icon" target="_blank" rel="noopener">${p.svg}</a>`)
      .join('');
  }

  // --- Links ---
  const linksEl = document.getElementById('links');
  if (linksEl) {
    const links = [
      { label: 'GitHub', url: '#', icon: 'GH' },
      { label: 'Twitter / X', url: '#', icon: '𝕏' },
      { label: 'Instagram', url: '#', icon: 'IG' },
    ];
    linksEl.innerHTML = links
      .map(
        (l) => `
      <a href="${l.url}" class="link-btn" target="_blank" rel="noopener">
        <span class="link-icon">${l.icon}</span>
        <span class="link-label">${l.label}</span>
        <span class="link-arrow">&#8599;</span>
      </a>`
      )
      .join('');
  }

  // ──────────────────────────────────────────────────────
  //  MUSIC PLAYER
  // ──────────────────────────────────────────────────────
  // ── CONFIG ────────────────────────────────────────────
  const songs = [
    {
      title: 'sunset',
      artist: 'Lucki',
      src: 'Sunset.mp3',
    },
  ];
  // ──────────────────────────────────────────────────────

  const audio = document.getElementById('audioEl');
  const playBtn = document.getElementById('playBtn');
  const trackName = document.getElementById('trackName');
  const trackArtist = document.getElementById('trackArtist');
  const barFill = document.getElementById('barFill');
  const barTrack = document.getElementById('barTrack');
  const timeCurrent = document.getElementById('timeCurrent');
  const timeTotal = document.getElementById('timeTotal');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const waveform = document.getElementById('waveform');

  var isPlaying = false;
  var autoplayBlocked = true;

  // Create waveform bars (visual only)
  var barCount = 36;
  var bars = [];
  for (var i = 0; i < barCount; i++) {
    var bar = document.createElement('div');
    bar.className = 'bar';
    waveform.appendChild(bar);
    bars.push(bar);
  }

  function formatTime(s) {
    if (isNaN(s) || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function updatePlayIcons() {
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  function togglePlay() {
    if (!audio.src) {
      audio.src = songs[0].src;
      trackName.textContent = songs[0].title;
      trackArtist.textContent = songs[0].artist;
      audio.load();
    }
    if (audio.paused) {
      audio.play().catch(function () {});
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
    updatePlayIcons();
  }

  function attemptAutoplay() {
    audio.play()
      .then(function () {
        isPlaying = true;
        updatePlayIcons();
        autoplayBlocked = false;
      })
      .catch(function () {
        autoplayBlocked = true;
      });
  }

  // Events
  audio.addEventListener('timeupdate', function () {
    if (audio.duration) {
      var pct = (audio.currentTime / audio.duration) * 100;
      barFill.style.width = pct + '%';
      timeCurrent.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', function () {
    timeTotal.textContent = formatTime(audio.duration);
  });

  // Volume slider
  var volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    audio.volume = parseFloat(volumeSlider.value);
    volumeSlider.addEventListener('input', function () {
      audio.volume = parseFloat(this.value);
    });
  }

  audio.addEventListener('play', function () { isPlaying = true; updatePlayIcons(); });
  audio.addEventListener('pause', function () { isPlaying = false; updatePlayIcons(); });

  playBtn.addEventListener('click', togglePlay);

  if (barTrack) {
    barTrack.addEventListener('click', function (e) {
      if (!audio.duration) return;
      var rect = barTrack.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });

  // Load and autoplay
  if (songs.length) {
    audio.src = songs[0].src;
    trackName.textContent = songs[0].title;
    trackArtist.textContent = songs[0].artist;
    attemptAutoplay();
  }

  // Waveform animation (idle visual only)
  function animateWaveform() {
    if (!isPlaying) {
      for (var j = 0; j < barCount; j++) {
        var t = performance.now() / 700;
        var h2 = 4 + Math.sin(t + j * 0.28) * 3.5 + Math.cos(t * 1.2 + j * 0.18) * 2.5;
        bars[j].style.height = Math.min(28, Math.max(3, h2)) + 'px';
      }
    } else {
      for (var k = 0; k < barCount; k++) {
        var t2 = performance.now() / 500 + k * 0.3;
        var h3 = 4 + Math.sin(t2) * 8 + Math.cos(t2 * 1.4) * 4;
        bars[k].style.height = Math.min(28, Math.max(3, h3)) + 'px';
      }
    }
    requestAnimationFrame(animateWaveform);
  }
  animateWaveform();

  function firstInteraction() {
    if (autoplayBlocked) {
      audio.play()
        .then(function () {
          isPlaying = true;
          updatePlayIcons();
          autoplayBlocked = false;
        })
        .catch(function () {});
    }
    document.removeEventListener('click', firstInteraction);
    document.removeEventListener('touchstart', firstInteraction);
    document.removeEventListener('keydown', firstInteraction);
  }

  if (autoplayBlocked) {
    document.addEventListener('click', firstInteraction);
    document.addEventListener('touchstart', firstInteraction);
    document.addEventListener('keydown', firstInteraction);
  }

  // Terminal (skidtopia-style floating window)
  var termWindow = document.getElementById('termWindow');
  var termBody = document.getElementById('termBody');
  var termInput = document.getElementById('termInput');
  var termHeader = document.getElementById('termHeader');
  var termClose = document.getElementById('termClose');
  var termOpen = false;
  var sessionStart = Date.now();

  function ct(cls, text) { return '<span class="term-text-' + cls + '">' + text + '</span>'; }

  function writeHTML(html) {
    var out = document.createElement('div');
    out.className = 'term-output';
    out.innerHTML = html;
    termBody.appendChild(out);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function writeCmd(command) {
    var div = document.createElement('div');
    div.className = 'cmd-line';
    div.innerHTML = 'stackup:~$ <span>' + command + '</span>';
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function openTerminal() { termWindow.classList.add('visible'); termWindow.setAttribute('aria-hidden', 'false'); setTimeout(function () { termInput.focus(); }, 50); }
  function closeTerminal() { termWindow.classList.remove('visible'); termWindow.setAttribute('aria-hidden', 'true'); termInput.blur(); }
  function toggleTerminal() { if (termWindow.classList.contains('visible')) { closeTerminal(); } else { openTerminal(); } }

  var termCommands = {
    help: function () {
      return '<div>Available commands:</div>' +
        '<div class="term-help-grid">' +
          '<code>help</code><span>show this help</span>' +
          '<code>projects</code><span>list my projects</span>' +
          '<code>clear</code><span>clear terminal</span>' +
          '<code>whoami</code><span>display user</span>' +
          '<code>date</code><span>current date/time</span>' +
          '<code>uptime</code><span>session uptime</span>' +
          '<code>ping</code><span>pong</span>' +
          '<code>echo</code><span>echo input</span>' +
          '<code>music</code><span>toggle music</span>' +
          '<code>github</code><span>open my github</span>' +
          '<code>neofetch</code><span>system info</span>' +
          '<code>exit</code><span>close terminal</span>' +
        '</div>';
    },
    projects: function () {
      return 'projects:\n  ' + ct('yellow', 'project1') + ' — https://github.com/yourhandle/project1\n  ' + ct('yellow', 'project2') + ' — https://github.com/yourhandle/project2';
    },
    clear: function () { termBody.innerHTML = ''; return null; },
    whoami: function () { return ct('green', '@c9a7'); },
    date: function () { return new Date().toString(); },
    uptime: function () { var t = Math.floor((Date.now() - sessionStart) / 1000); var m = Math.floor(t / 60); var s = t % 60; return m + 'm ' + s + 's'; },
    ping: function () { return ct('green', 'pong'); },
    echo: function (args) { return args || ''; },
    music: function () { togglePlay(); return audio.paused ? ct('yellow', 'paused') : ct('green', 'playing'); },
    github: function () { window.open('https://github.com/st-ackz', '_blank'); return ct('green', 'opening github...'); },
    neofetch: function () {
      var ascii = [
        '⠀⠀⠀⠀⣀⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀',
        '⠀⠀⠀⣿⡏⡏⡏⡏⡏⡏⡏⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷',
        '⠀⠀⠀⣿⢸⡇⡇⡇⡇⢸⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟',
        '⠀⠀⠀⠉⠙⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⡿⠿⢿⣿⡿⠿⠿⠿⠿⠿⠛⠛⠛⠃',
        '⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⠲⡸⣄⠀⠀⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠀⣸⣿⣿⣿⣿⣿⠀⡿⠛⠿⠿⠻⠶⠿⠿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⢸⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠻⡯⣭⣭⣭⣭⣥⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
        '⠀⠀⠀⠛⠛⠓⠛⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
      ];
      var data = [
        [ct('red', 'User'), ct('yellow', 'stackz')],
        [ct('red', 'OS'), 'stackzOS'],
        [ct('red', 'CPU'), 'i9 12900k'],
        [ct('red', 'GPU'), 'RTX 3060 ti'],
        [ct('red', 'Status'), ct('green', 'doxxed you')],
      ];
      var lines = [];
      for (var i = 0; i < Math.max(ascii.length, data.length); i++) {
        var a = (ascii[i] || '').replace(/ /g, '&nbsp;');
        var d = data[i] || ['', ''];
        lines.push('<span style="display:inline-block;white-space:pre">' + a + '</span>  ' + d[0] + ' ' + d[1]);
      }
      return lines.join('<br>');
    },
    exit: function () { closeTerminal(); return null; },
  };

  function runCommand(raw) {
    var cmd = raw.trim();
    if (!cmd) return;
    writeCmd(cmd);
    var parts = cmd.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');
    var fn = termCommands[name];
    if (fn) {
      var result = fn(args);
      if (result !== null && result !== undefined) writeHTML(result);
    } else {
      writeHTML(ct('red', 'command not found: ' + name) + '<br><span class="term-text-muted">type ' + ct('yellow', 'help') + ' for commands</span>');
    }
  }

  termInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { runCommand(termInput.value); termInput.value = ''; }
    if (e.key === 'Escape') { closeTerminal(); termInput.value = ''; }
  });

  termClose.addEventListener('click', closeTerminal);

  document.addEventListener('keydown', function (e) {
    if (e.key === '`' || e.key === '~') { e.preventDefault(); toggleTerminal(); }
  });

  // Dragging
  var dragging = false, dragOX, dragOY;
  termHeader.addEventListener('mousedown', function (e) {
    if (e.target.closest('.float-close')) return;
    dragging = true;
    dragOX = e.clientX - termWindow.offsetLeft;
    dragOY = e.clientY - termWindow.offsetTop;
    termWindow.classList.add('dragged');
  });
  document.addEventListener('mouseup', function () { dragging = false; });
  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    termWindow.style.left = (e.clientX - dragOX) + 'px';
    termWindow.style.top = (e.clientY - dragOY) + 'px';
  });

  // Boot message
  writeHTML(ct('yellow', 'booting stackzOS v2...'));
  writeHTML('type ' + ct('yellow', 'help') + ' for commands');

  // Background field animation (grid + particles + perspective boxes)
  var fieldCanvas = document.getElementById('particles');
  if (fieldCanvas) {
    var fCtx = fieldCanvas.getContext('2d');
    var fW, fH;
    var fDpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function resizeField() {
      fW = window.innerWidth;
      fH = window.innerHeight;
      fieldCanvas.width = fW * fDpr;
      fieldCanvas.height = fH * fDpr;
      fieldCanvas.style.width = fW + 'px';
      fieldCanvas.style.height = fH + 'px';
      fCtx.scale(fDpr, fDpr);
    }
    window.addEventListener('resize', resizeField);
    resizeField();

    function Particle() {
      this.reset(true);
    }
    Particle.prototype.reset = function (randomY) {
      this.x = Math.random() * fW;
      this.y = randomY ? Math.random() * fH : fH + 10;
      this.size = Math.random() * 1.6 + 0.4;
      this.speed = Math.random() * 1.1 + 0.35;
      this.alpha = Math.random() * 0.55 + 0.2;
    };
    Particle.prototype.update = function () {
      this.y -= this.speed;
      var dx = this.x - mouseX;
      var dy = this.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var interactRadius = 180;
      if (dist < interactRadius) {
        var force = (interactRadius - dist) / interactRadius;
        this.x += (dx / dist) * force * 2.8;
        this.y += (dy / dist) * force * 2.8;
      }
      if (this.y < -10) this.reset(false);
    };
    Particle.prototype.draw = function () {
      fCtx.beginPath();
      fCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      fCtx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
      fCtx.fill();
    };

    var particles = [];
    var particleCount = Math.min(320, Math.floor((fW * fH) / 4200));
    for (var i = 0; i < particleCount; i++) particles.push(new Particle());

    function connectParticles() {
      fCtx.lineWidth = 0.6;
      for (var i = 0; i < particles.length; i++) {
        var a = particles[i];
        if (a.alpha < 0.35) continue;
        var links = 0;
        for (var j = i + 1; j < particles.length && links < 3; j++) {
          var b = particles[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dist2 = dx * dx + dy * dy;
          if (dist2 < 12000) {
            links++;
            var opacity = (1 - dist2 / 12000) * 0.14;
            fCtx.beginPath();
            fCtx.moveTo(a.x, a.y);
            fCtx.lineTo(b.x, b.y);
            fCtx.strokeStyle = 'rgba(255, 255, 255, ' + opacity + ')';
            fCtx.stroke();
          }
        }
      }
    }

    function drawGrid() {
      var step = 110;
      var major = 330;
      var offset = (performance.now() / 50) % step;

      fCtx.strokeStyle = 'rgba(255,255,255,0.045)';
      fCtx.lineWidth = 1;
      for (var x = offset; x < fW; x += step) {
        fCtx.beginPath(); fCtx.moveTo(x, 0); fCtx.lineTo(x, fH); fCtx.stroke();
      }
      for (var y = offset; y < fH; y += step) {
        fCtx.beginPath(); fCtx.moveTo(0, y); fCtx.lineTo(fW, y); fCtx.stroke();
      }

      fCtx.strokeStyle = 'rgba(255,255,255,0.09)';
      fCtx.lineWidth = 1.3;
      for (var x = offset; x < fW; x += major) {
        fCtx.beginPath(); fCtx.moveTo(x, 0); fCtx.lineTo(x, fH); fCtx.stroke();
      }
      for (var y = offset; y < fH; y += major) {
        fCtx.beginPath(); fCtx.moveTo(0, y); fCtx.lineTo(fW, y); fCtx.stroke();
      }
    }

    function drawPerspectiveBoxes() {
      var time = performance.now() / 2000;
      var cx = fW / 2;
      var cy = fH * 0.72;
      for (var i = 0; i < 4; i++) {
        var z = ((time + i * 0.25) % 1);
        var s = 80 + z * 500;
        var alpha = 1 - z;
        fCtx.strokeStyle = 'rgba(255,255,255,' + (0.08 * alpha) + ')';
        fCtx.strokeRect(cx - s / 2, cy - s * 0.12, s, s * 0.24);
      }
    }

    function animateField() {
      fCtx.clearRect(0, 0, fW, fH);
      drawGrid();
      drawPerspectiveBoxes();
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateField);
    }
    animateField();
  }

  // 3D tilt on profile card
  var card = document.getElementById('profile');
  if (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 30) + 'deg) rotateX(' + (-y * 30) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  }
})();
