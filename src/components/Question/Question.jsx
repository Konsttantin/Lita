import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import cl from './Question.module.css';
import Answers from './Answers/Answers';

const Question = ({ header, type, answers, tooltip }) => {
  const [showTip, setShowTip] = useState(false);

  const tip = useRef(null);

  useEffect(() => {
    tip.current.style.transform = 'none';

    const tipOffset = window.screen.width - tip.current.getBoundingClientRect().right;

    if (tipOffset < 0) {
      tip.current.style.transform = `translateX(${tipOffset - 7}px)`;
    }

  }, [header]);

  return (
    <div className={cl.wrapper}>
      <h1 className={cl.header}>
        {header.split(' ').slice(0, -1).join(' ') + ' '}

        <span className={cl.lastWord}>
          {header.split(' ').slice(-1).join('')}

          <button
            onClick={() => setShowTip(!showTip)}
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

        </span>
      </h1>

      <Answers
        type={type}
        answers={answers}
      />
    </div>
  );
};

export default Question;