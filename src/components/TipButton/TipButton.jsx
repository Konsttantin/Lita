import { useEffect, useRef, useState } from "react";
import cn from "classnames";

import cl from './TipButton.module.css';

const TipButton = ({ tooltip }) => {
  const [showTip, setShowTip] = useState(false);

  const tip = useRef(null);
  const tipButton = useRef(null);

  useEffect(() => {
    tip.current.style.transform = 'none';

    const rightShift = window.screen.width - tip.current.getBoundingClientRect().right;
    const leftShift = tip.current.getBoundingClientRect().right - tip.current.offsetWidth;

    if (rightShift < 0) {
      tip.current.style.transform = `translateX(${rightShift - 7}px)`;
    }

    if (leftShift < 0) {
      tip.current.style.transform = `translateX(${-leftShift + 7}px)`;
    }

    const hideTipHandler = (event) => {
      if (event.target.closest('.' + tipButton.current.className)) {
        return;
      }

      tipButton.current.blur();
    };

    document.addEventListener('click', hideTipHandler)

    return () => {
      document.removeEventListener('click', hideTipHandler);
    }
  }, [tooltip]);

  return (
    <button
      ref={tipButton}
      onClick={() => {
        setShowTip(!showTip);
        tipButton.current.focus();
      }}
      onBlur={() => setShowTip(false)}
      className={cl.tipButton}
    >
      <img src="svg/tip-button.SVG" alt="tip" />

      {showTip && (
        <img className={cl.tipTale} src="svg/tooltip-tale.SVG" alt="tale" />
      )}
      
      <div
        ref={tip}
        className={cn(cl.tooltip, { [cl.hidden]: !showTip })}
      >
        {tooltip}
      </div>
    </button>
  );
};

export default TipButton;
