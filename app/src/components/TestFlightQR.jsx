import { useEffect, useRef } from 'react';
import { useT } from '../i18n';
import { TESTFLIGHT } from '../data/site';

/**
 * 桌面端点 TestFlight 链接 → 扫码层（2026-10-26）。电脑上打开 testflight.apple.com 是死路，
 * App 只能装在 iPhone 上，所以有精确指针 + 悬停的设备上拦下点击，改为显示二维码；
 * 手机 / 平板照常跳转。修饰键（新标签、复制链接）不拦。
 *
 * 统计不变：链接上的 data-umami-event="cta-testflight" 照常由 Umami 在捕获阶段记录
 * （target=_blank 的链接 Umami 只记不跳），这里不另发事件。
 *
 * /images/testflight-qr.svg 是用 qrcode@1.5.4 对 TESTFLIGHT 生成的静态文件
 * （纠错 M、边距 2、#16140f on #fbfaf7）；TESTFLIGHT 变了要重新生成。
 */
export default function TestFlightQR() {
  const { t } = useT();
  const ref = useRef(null);
  useEffect(() => {
    const desktop = window.matchMedia('(hover: hover) and (pointer: fine)');
    const onClick = (e) => {
      if (!desktop.matches || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.(`a[href="${TESTFLIGHT}"]`);
      if (!a || a.closest('.tfqr') || !ref.current) return;
      e.preventDefault();
      document.querySelector('dialog.menu[open]')?.close();
      ref.current.showModal();
      window.__lenis?.stop();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
    <dialog
      className="tfqr island-light"
      ref={ref}
      aria-label={t('用 iPhone 扫码安装 App', 'Scan with your iPhone to install the app')}
      onClose={() => window.__lenis?.start()}
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
    >
      <div className="tfqr__inner">
        <div className="tfqr__top">
          <span className="t-ui">IOS APP · TESTFLIGHT</span>
          <button type="button" className="menu__close t-ui" onClick={() => ref.current?.close()}>{t('关闭', 'Close')} ✕</button>
        </div>
        <img className="tfqr__code" src="/images/testflight-qr.svg" width="220" height="220" loading="lazy" alt={t('TestFlight 安装二维码', 'TestFlight install QR code')} />
        <p className="tfqr__title">{t('用 iPhone 相机扫码安装', 'Scan with your iPhone camera')}</p>
        <p className="t-body-sm tfqr__note">{t('App 需要在 iPhone 上安装。扫码后先装 Apple 的 TestFlight，再点「接受」并安装 Piano Tuner。', "The app installs on iPhone. After scanning, get Apple's TestFlight first, then tap Accept and install Piano Tuner.")}</p>
        <a className="blink t-ui" href={TESTFLIGHT} target="_blank" rel="noopener noreferrer">{t('仍要在本机打开链接 ↗', 'Open the link here anyway ↗')}</a>
      </div>
    </dialog>
  );
}
