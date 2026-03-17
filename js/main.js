/* ============================================================
   UI比較集 — 共通JavaScript
   全ページで読み込む共通の機能を定義。
   ============================================================ */

/* ---- ダークモード管理 ---- */
// ページ読み込み時にローカルストレージから設定を復元
(function initTheme() {
  const saved = localStorage.getItem('theme') || 'light'; // 保存済みテーマを取得
  document.documentElement.setAttribute('data-theme', saved); // htmlタグに適用
})();

// トグルスイッチの初期化
function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle'); // トグル要素を取得
  if (!toggle) return; // 要素がなければ終了

  const current = document.documentElement.getAttribute('data-theme');
  toggle.checked = current === 'dark'; // 保存済み状態に合わせてチェック

  toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light'; // チェック状態でテーマ決定
    document.documentElement.setAttribute('data-theme', theme); // htmlタグを更新
    localStorage.setItem('theme', theme); // ローカルストレージに保存
  });
}

/* ---- コードスニペット表示・コピー機能 ---- */
function setupCodeSnippets() {
  // 「Show Code」ボタン全てにイベントを設定
  document.querySelectorAll('.show-code-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target); // 対象のコードブロック
      if (!target) return;
      const isVisible = target.classList.toggle('visible'); // 表示/非表示切替
      btn.textContent = isVisible ? '▲ コードを隠す' : '▶ コードを表示'; // ボタンテキスト変化
    });
  });

  // 「Copy」ボタン全てにイベントを設定
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pre = btn.nextElementSibling; // 隣のpreタグを取得
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent); // クリップボードにコピー
        btn.textContent = '✓ コピー完了!';         // 成功表示
        btn.classList.add('copied');             // スタイル変化
        setTimeout(() => {
          btn.textContent = 'コピー';              // 2秒後に元のテキストへ
          btn.classList.remove('copied');
        }, 2000);
      } catch (e) {
        btn.textContent = 'コピー失敗'; // コピー失敗時
      }
    });
  });
}

/* ---- モバイルサイドバー開閉 ---- */
function setupSidebar() {
  const toggle = document.getElementById('menu-toggle'); // ハンバーガーボタン
  const sidebar = document.getElementById('sidebar');    // サイドバー要素
  const overlay = document.getElementById('sidebar-overlay'); // 背景オーバーレイ

  if (!toggle || !sidebar) return;

  // ハンバーガーボタンでサイドバーを開く
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  });

  // オーバーレイクリックでサイドバーを閉じる
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }
}

/* ---- 現在のページのサイドバーリンクをハイライト ---- */
function highlightActiveSidebarLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.includes(currentPage)) {
      link.classList.add('active'); // アクティブクラスを付与
    }
  });
}

/* ---- Rippleエフェクト（Material Design風クリックアニメーション） ---- */
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span'); // リップル要素を生成
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  // クリック位置を基準にリップルを配置
  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top  = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple'); // CSSアニメーションクラスを付与

  // 既存のリップルを削除してから追加
  const existing = button.querySelector('.ripple');
  if (existing) existing.remove();
  button.appendChild(circle);
}

function setupRippleButtons() {
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', createRipple); // クリック時にリップル発生
  });
}

/* ---- Magnetic Button（カーソル追従エフェクト） ---- */
function setupMagneticButtons() {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;   // 中心からのX距離
      const y = e.clientY - rect.top  - rect.height / 2;  // 中心からのY距離
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`; // 30%追従
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = ''; // マウスが離れたら元の位置に戻る
    });
  });
}

/* ---- 3D Tilt Card エフェクト ---- */
function setupTiltCards() {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;  // -10〜10度
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
      card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = ''; // 元に戻す
    });
  });
}

/* ---- 共通文言を日本語に統一 ---- */
function setupJapaneseLocalization() {
  const textMap = new Map([
    ['Back to Home', 'ホームへ戻る'],
    ['Component Variants', 'コンポーネント一覧'],
    ['Default', '標準'],
    ['Outline', 'アウトライン'],
    ['Soft', 'ソフト'],
    ['Copy', 'コピー'],
    ['Show Code', 'コードを表示'],
    ['Hide Code', 'コードを隠す'],
    ['▶ Show Code', '▶ コードを表示'],
    ['▲ Hide Code', '▲ コードを隠す']
  ]);

  document.querySelectorAll('button, a, span, p, h1, h2, h3, h4, h5, h6').forEach(el => {
    const raw = el.textContent?.trim();
    if (!raw) return;
    if (textMap.has(raw)) {
      el.textContent = textMap.get(raw);
    }
  });
}

/* ---- ページ読み込み時に全機能を初期化 ---- */
document.addEventListener('DOMContentLoaded', () => {
  setupJapaneseLocalization(); // 共通文言の日本語化
  setupThemeToggle();        // ダークモード
  setupCodeSnippets();       // コードスニペット
  setupSidebar();            // モバイルサイドバー
  highlightActiveSidebarLink(); // アクティブリンク
  setupRippleButtons();      // リップルエフェクト
  setupMagneticButtons();    // 磁石エフェクト
  setupTiltCards();          // 3Dチルトカード
});
