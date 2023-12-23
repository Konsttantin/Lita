import { useState } from 'react';
import ContactsBox from '../../ContactsBox/ContactsBox';
import TipButton from '../../TipButton/TipButton';
import cl from './TestResults.module.css';
import cn from 'classnames';
import BuyModal from '../../BuyModal/BuyModal';

const TestResults = ({ isRiskHigh }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);

  const tooltip = 'Памʼятайте! Ризик розвитку раку не означає, що він у Вас точно виникне.';
  const paymentLink = 'https://www.liqpay.ua/api/3/checkout?data=eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOiI1MyIsImN1cnJlbmN5IjoiVUFIIiwiZGVzY3JpcHRpb24iOiLQhtC90LTQuNCy0ZbQtNGD0LDQu9GM0L3QuNC5INC/0YDQvtGE0ZbQu9Cw0LrRgtC40YfQvdC40Lkg0LrQsNC70LXQvdC00LDRgCIsInB1YmxpY19rZXkiOiJzYW5kYm94X2k2NjMwNjk4MzA4MyIsImxhbmd1YWdlIjoidWsifQ==&signature=ghPcWu1qUuw1MF7GumiLyWuyON0=';

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
        {isRiskHigh ? 'Ви маєте підвищений ризик розвитку раку. Саме тому вам слід ' : 'Ви маєте середньостатистичний ризик розвитку раку. Тому, за бажанням, ви можете '}
        {'дізнатись про методи скринінгу, які націлені на його раннє виявлення, що полегшить лікування і знизить ризик для '}

        <span className={cl.lastWord}>
          вас.

          <TipButton tooltip={tooltip} />
        </span>
      </div>

      <p className={cl.description}>
        Ви можете отримати готовий профілактичний план з оцінкою ризиків та рекомендаціями стосовно попередження від наших лікарів за символічну вартість чашки кави. Або ж можете самостійно проаналізувати свої відповіді та скористатись джерелами для аналізу та отримання рекомендацій.
      </p>

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
          onAgree={() => window.open(paymentLink, '_blank')}
        />
      )}

      <p className={cl.description}>
        Послуга включає аналіз лікарем ваших відповідей та персоналізований список з оцінкою ризику виникнення 4-х видів раку згідно з міжнародними профілактичними протоколами від The American College of Obstetricians and Gynecologists, National Cancer Institute, The American Cancer Society, Centers for Disease Control and Prevention, European Society For Medical Oncology, United States Preventive Services Task Force. А також список методів діагностики з детальним описом чому такий ризик є та списком лікарів, до яких треба звернутись. Ви отримаєте їх в форматі PDF, протягом 3-х днів - на пошту, яку вкажете на сторінці платіжної системи. Якщо вас не влаштує надана послуга - ми повернемо вам кошти, згідно Договору-Оферти.
      </p>

      <a
        className={cl.loadInfoButton}
        href="https://drive.google.com/file/d/1f46gIaOsy4JtshATNBAx8NmRiNJtPwwh/view?usp=sharing"
        target="_blank"
        rel="noreferrer"
      >
        {'Джерела для самостійної оцінки відповідей'}
        <img src="svg/category-arrow.SVG" alt="arrow" />
      </a>

      <ContactsBox />
    </div>
  );
};

export default TestResults;
