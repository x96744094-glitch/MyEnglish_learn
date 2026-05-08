import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 偵測是否已安裝
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // 偵測 iOS
    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const safari = /safari/.test(window.navigator.userAgent.toLowerCase());
    if (ios && safari) {
      setIsIOS(true);
      // iOS 不支援 beforeinstallprompt，顯示手動說明
      const dismissed = localStorage.getItem('pwa-ios-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000);
      }
      return;
    }

    // Android / Chrome：監聽安裝提示
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('pwa-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 3000);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);

    // 安裝完成後隱藏
    window.addEventListener('appinstalled', () => {
      setShowBanner(false);
      setIsInstalled(true);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(isIOS ? 'pwa-ios-dismissed' : 'pwa-dismissed', '1');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'env(safe-area-inset-bottom, 16px)',
      left: 16,
      right: 16,
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      color: 'white',
      borderRadius: 16,
      padding: '16px 20px',
      boxShadow: '0 8px 32px rgba(79,70,229,0.4)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      animation: 'slideUp 0.4s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* 圖示 */}
      <div style={{ fontSize: '2.2rem', flexShrink: 0 }}>📚</div>

      {/* 文字 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 3 }}>
          安裝英文學習平台
        </div>
        {isIOS ? (
          <div style={{ fontSize: '0.78rem', opacity: 0.9, lineHeight: 1.4 }}>
            點擊 Safari 底部的 <strong>分享</strong> 按鈕 →
            選擇「<strong>加入主畫面</strong>」即可安裝
          </div>
        ) : (
          <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
            加入主畫面，像 App 一樣快速開啟
          </div>
        )}
      </div>

      {/* 按鈕 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
        {!isIOS && (
          <button
            onClick={handleInstall}
            style={{
              background: 'white',
              color: '#4F46E5',
              border: 'none',
              borderRadius: 8,
              padding: '7px 14px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            立即安裝
          </button>
        )}
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          以後再說
        </button>
      </div>
    </div>
  );
}
