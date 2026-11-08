import { forwardRef } from 'react';

/**
 * 音叉标记：单色（currentColor），旁边一段拍频波形。state: idle | hint | thinking。
 * hint 时右上角一个强调色小点（信号，不是平涂）；thinking 时波形由 Assistant 用 GSAP 驱动。
 */
const ForkMark = forwardRef(function ForkMark({ state, label, onClick, expanded }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className="fork__mark"
      data-state={state}
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
    >
      <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M9 6v12a4 4 0 0 0 8 0V6" />
          <path d="M13 22v9" />
        </g>
        <path className="fork__wave" d="M20 18c1.5-4 3-4 4.5 0s3 4 4.5 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle className="fork__dot" cx="30" cy="7" r="2.5" />
      </svg>
    </button>
  );
});

export default ForkMark;
