import { useState } from 'react';
import ContactsBox from '../../ContactsBox/ContactsBox';
import TipButton from '../../TipButton/TipButton';
import cl from './TestResults.module.css';
import cn from 'classnames';
import BuyModal from '../../BuyModal/BuyModal';

const TestResults = ({ isRiskHigh }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const tooltip = 'Памʼятайте! Ризик розвитку раку не означає, що він у Вас точно виникне. Проте, якщо це все ж станеться, скринінг націлений на його раннє виявлення. Це полегшить лікування і знизить ризик смерті для Вас. Висновок не є остаточним діагнозом і потребує очної консультації з лікарем.';

  return (
    // <ul className={cl.results}>
    //   {answers.map(answer => (
    //     <li
    //       key={answer.id}
    //       className={cl.item}
    //     >
    //       <p className={cl.answerContent}>
    //         <span className={cl.itemTitle}>{answer.question}</span>
    //         {answer.values.map(value => (
    //           <span key={value} className={cl.itemAnswer}>{value} {answer.unit}</span>
    //         ))}
    //       </p>
    //     </li>
    //   ))}
    // </ul>
    <div className={cl.resultsContainer}>
      <div className={cn(cl.riskMessage, {[cl.highRisk] : isRiskHigh})}>
        {isRiskHigh ? 'Ви маєте підвищений ризик розвитку раку. ' : 'Ви маєте середньостатистичний ризик розвитку раку. '}
        {'Ви можете отримати готовий профілактичний план з оцінкою ризиків та рекомендаціями стосовно попередження від наших лікарів за символічну вартість чашки кави. Або ж можете самостійно проаналізувати свої відповіді та скористатись джерелами для аналізу та отримання рекомендацій, які знайдете за '}

        <span className={cl.lastWord}>
          посиланням.

          <TipButton tooltip={tooltip} />
        </span>
      </div>

      <div className={cl.additionalInfo}>
        <span className={cl.infoTitle}>Ризики, які ми оцінюємо:</span>
        <ul className={cl.infoList}>
          <li>1. Рак молочної залози</li>
          <li>2. Рак шийки матки</li>
          <li>3. Рак легень</li>
          <li>4. Колоректальний рак</li>
        </ul>
      </div>

      <button
        className={cl.buyButton}
        // href="https://pay.fondy.eu/s/JKQXLmeBiZGbtG"
        onClick={() => setShowBuyModal(true)}
      >
        {'Отримати профілактичний план від лікаря за 53 грн'}
        <img src="svg/category-arrow.SVG" alt="arrow" />
      </button>

      {showBuyModal && (
        <BuyModal
          onClose={() => setShowBuyModal(false)}
          onAgree={() => window.open('https://pay.fondy.eu/s/JKQXLmeBiZGbtG', '_blank')}
        />
      )}

      <a
        className={cl.loadInfoButton}
        href="https://drive.google.com/file/d/1eQ46k5Mv_VIpNFtkU-4T2gjCYbR6wv-E/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
      >
        {'Джерела для самостійної оцінки відповідей'}
        <img src="svg/category-arrow.SVG" alt="arrow" />
      </a>

      <p className={cl.buttonDescription}>
        В подальшому додаток автоматично аналізуватиме та безкоштовно виводитиме індивідуальні плани профілактики, але лише завдяки вашій підтримці ми зможемо завершити розробку швидко.
      </p>

      <ContactsBox />
    </div>
  );
};

export default TestResults;
