import cl from './ModulePages.module.css';

const RecommendationsPage = ({ onClose }) => {
  return (
    <div className={cl.page}>
      <div className={cl.content}>
        <p className={cl.paragraph}>
          Ви можете самостійно розрахувати свої ризики виникнення онкологічних захворювань та скласти профілактичний план за допомогою ресурсів, наведених нижче.
        </p>

        <p className={cl.paragraph}>
          Оскільки для створення нашого опитування ми користувались рекомендаціями від авторитетних міжнародних медичних організацій першими в списку ви можете знайти посилання саме на їхні протоколи. Наступними в черзі йдуть посилання на статті Центру громадського здоров’я МОЗ України. (Просто натисність на назву)
        </p>

        <a
          href="https://www.cancer.org/cancer/types/breast-cancer/screening-tests-and-early-detection.html"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику раку молочних залоз (American Cancer Society)
        </a><br />

        <a
          href="https://www.cancer.org/cancer/types/lung-cancer/detection-diagnosis-staging.html"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризиĸу раĸу легень (American Cancer Society)
        </a><br />

        <a
          href="https://www.cancer.org/cancer/types/colon-rectal-cancer/detection-diagnosis-staging.html"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику колоректального раку (American Cancer Society)
        </a><br />

        <a
          href="https://www.acog.org/womens-health/faqs/cervical-cancer-screening#:~:text=Women%20who%20are%2021%20to,%2Dtesting)%20every%205%20years."
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику раку шийки матки (The American College of Obstetricians and Gynecologists)
        </a><br />

        <p className={cl.paragraph}>
          Посилання на сайт Центру громадського здоров’я МОЗ України:
        </p>

        <a
          href="https://www.phc.org.ua/news/vseukrainskiy-den-borotbi-iz-zakhvoryuvannyam-na-rak-molochnikh-zaloz-pravila-samooglyadu"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику раку молочних залоз
        </a><br />

        <a
          href="https://www.phc.org.ua/news/scho-vazhlivo-znati-pro-rak-legen"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику раку легень
        </a><br />

        <a
          href="https://www.phc.org.ua/news/skrining-raku-shiyki-matki-ta-ranne-viyavlennya-khvorobi"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Визначення ризику раку шийки матки
        </a><br />

        <a
          href="https://www.phc.org.ua/news/pro-yaki-skriningi-vazhlivo-znati-cholovikam"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Загальні рекомендації (також в статті наведено схему профілактики колоректального раку (не залежить від статі))
        </a><br />

        <p className={cl.paragraph}>
          Ми будемо надзвичайно вдячні, якщо ви заповните форму-відгук стосовно поточної версії додатку. Нам дуже важлива Ваша думка для подальшої розробки функціоналу
        </p>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSd0Vn7w6gejibZXYx60fgp2GuibhYBvYt-RX6EUqGFY_mhZfw/viewform"
          target='_blank'
          rel="noreferrer"
          className={cl.link}
        >
          Залишити відгук про додаток
        </a><br />
      </div>

      <button
        className={cl.backButton}
        onClick={onClose}
      >
        Назад
      </button>
    </div>
  );
};

export default RecommendationsPage;