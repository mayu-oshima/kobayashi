// クッキー取得関数
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// クッキー設定関数
function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// fontchange
document.addEventListener('DOMContentLoaded', function () {
  const history = getCookie('fontSize');
  const elm = document.documentElement;

  if (!history) {
    elm.classList.add('fontS');
    document.getElementById('fontS').classList.add('active');
  } else {
    elm.classList.add(history);
    const activeBtn = document.getElementById(history);
    if (activeBtn) activeBtn.classList.add('active');
  }

  const fontButtons = document.querySelectorAll('.fontchange li');
  fontButtons.forEach(button => {
    button.addEventListener('click', function () {
      if (!this.classList.contains('active')) {
        document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
        this.classList.add('active');

        const setFontSize = this.id;
        setCookie('fontSize', setFontSize);

        elm.className = '';
        elm.classList.add(setFontSize);
      }
    });
  });
});

// gnav
document.addEventListener('DOMContentLoaded', function () {
  const humburger = document.querySelector('.humburger');
  const navSp = document.querySelector('.nav_sp');

  if (!humburger || !navSp) return;

  // 初期状態：閉じた状態
  navSp.style.maxHeight = '0px';

  humburger.addEventListener('click', function () {
    const isOpen = navSp.classList.contains('open');

    if (isOpen) {
      // 閉じる処理
      navSp.classList.remove('open');
      navSp.classList.add('closing');
      navSp.style.maxHeight = navSp.scrollHeight + 'px'; // 一度高さを設定してから
      requestAnimationFrame(() => {
        navSp.style.maxHeight = '0px'; // 0にしてアニメーション開始
      });

      navSp.addEventListener('transitionend', function handler() {
        navSp.classList.remove('closing');
        navSp.removeEventListener('transitionend', handler);
      });

    } else {
      // 開く処理
      navSp.classList.add('opening');
      navSp.style.maxHeight = navSp.scrollHeight + 'px';

      navSp.addEventListener('transitionend', function handler() {
        navSp.classList.remove('opening');
        navSp.classList.add('open');
        navSp.style.maxHeight = 'none'; // 開いた後は制限解除
        navSp.removeEventListener('transitionend', handler);
      });
    }

    // ハンバーガーアイコンの開閉状態切替
    humburger.classList.toggle('open_nav');
  });
});

// smooth_scroll
document.addEventListener('DOMContentLoaded', function () {
  const pagetop = document.querySelector('.pagetop');
  if (pagetop) pagetop.style.display = 'none';

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      pagetop.style.display = 'block';
      pagetop.style.opacity = '1';
    } else {
      pagetop.style.display = 'none';
      pagetop.style.opacity = '0';
    }

    // フッター手前でストップ
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.innerHeight + window.scrollY;
    const footer = document.querySelector('footer');
    const footHeight = footer ? footer.offsetHeight : 0;

    if (scrollHeight - scrollPosition <= footHeight) {
      pagetop.style.position = 'absolute';
      pagetop.style.bottom = `${footHeight}px`;
    } else {
      pagetop.style.position = 'fixed';
      pagetop.style.bottom = '0';
    }
  });

  if (pagetop) {
    pagetop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});