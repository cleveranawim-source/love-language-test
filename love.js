/* 러블리 효과: 떠오르는 하트 / 선택 시 하트 퍼짐 / 결과 하트 비.
   기능 코드와 분리되어 있고, 모션 줄이기 설정이면 아무것도 하지 않는다. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var COLORS = ['#F59AB2', '#E85A82', '#C93D63', '#F4B6A0', '#E8956B', '#D9A0DD'];
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };

  /* 1) 배경에 천천히 떠오르는 하트 */
  function mountHearts() {
    var box = document.createElement('div');
    box.className = 'love-hearts';
    box.setAttribute('aria-hidden', 'true');
    var n = window.innerWidth < 600 ? 10 : 16;
    for (var i = 0; i < n; i++) {
      var h = document.createElement('i');
      h.textContent = '♥';
      h.style.left = rnd(0, 100) + '%';
      h.style.fontSize = rnd(12, 30) + 'px';
      h.style.color = pick(COLORS);
      h.style.setProperty('--o', rnd(0.12, 0.28).toFixed(2));
      h.style.setProperty('--sway', rnd(-40, 40).toFixed(0) + 'px');
      h.style.animationDuration = rnd(16, 30).toFixed(1) + 's';
      h.style.animationDelay = (-rnd(0, 30)).toFixed(1) + 's';
      box.appendChild(h);
    }
    document.body.insertBefore(box, document.body.firstChild);
  }

  /* 2) 선택·클릭 지점에서 작은 하트가 퍼진다 */
  function burst(x, y, count) {
    for (var i = 0; i < count; i++) {
      var b = document.createElement('i');
      b.className = 'love-burst';
      b.textContent = '♥';
      var ang = (Math.PI * 2 * i) / count + rnd(-0.35, 0.35);
      var dist = rnd(46, 96);
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      b.style.fontSize = rnd(12, 24) + 'px';
      b.style.color = pick(COLORS);
      b.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      b.style.setProperty('--dy', Math.sin(ang) * dist - 24 + 'px');
      b.style.setProperty('--rot', rnd(-40, 40) + 'deg');
      document.body.appendChild(b);
      setTimeout((function (el) { return function () { el.remove(); }; })(b), 1000);
    }
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.option, .likert-btn, .btn, .ver-card');
    if (!t) return;
    var x = e.clientX, y = e.clientY;
    if (!x && !y) { var r = t.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
    burst(x, y, t.matches('.option, .likert-btn') ? 9 : 7);
  }, true);

  /* 3) 결과 화면이 나타나면 하트가 흩날린다 */
  function rain(count) {
    for (var i = 0; i < count; i++) {
      (function (i) {
        setTimeout(function () {
          var r = document.createElement('i');
          r.className = 'love-rain';
          r.textContent = '♥';
          r.style.left = rnd(0, 100) + 'vw';
          r.style.fontSize = rnd(14, 34) + 'px';
          r.style.color = pick(COLORS);
          r.style.setProperty('--drift', rnd(-80, 80) + 'px');
          r.style.setProperty('--spin', rnd(-260, 260) + 'deg');
          r.style.animationDuration = rnd(2.6, 4.6).toFixed(1) + 's';
          document.body.appendChild(r);
          setTimeout(function () { r.remove(); }, 5200);
        }, i * 70);
      })(i);
    }
  }
  function watchResult() {
    var res = document.getElementById('screen-result');
    if (!res) return;
    var was = res.classList.contains('active');
    new MutationObserver(function () {
      var now = res.classList.contains('active');
      if (now && !was) rain(34);
      was = now;
    }).observe(res, { attributes: true, attributeFilter: ['class'] });
  }

  function init() { mountHearts(); watchResult(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
