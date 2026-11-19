import type { Locale } from "../core/types";

export type { Locale };

/** Все тексты интерфейса в трёх локализациях. */
export interface Dict {
  tagline: string;

  tab: { today: string; calendar: string; stats: string; settings: string };

  theme: {
    dark: string;
    light: string;
    toLight: string;
    toDark: string;
    nowDark: string;
    nowLight: string;
  };

  /** Короткие подписи статусов: «Алкоголь» / «Без алкоголя» / «Не отмечено» */
  status: { alcohol: string; alcohol_free: string; unmarked: string };
  /** Длинные подписи для выбора в редакторе */
  statusLong: { alcohol: string; alcohol_free: string };
  statusHint: { alcohol: string; alcohol_free: string };

  legend: { title: string; alcohol: string; alcohol_free: string; unmarked: string };

  today: {
    onDay: string;
    markFree: string;
    markAlcohol: string;
    unmarkedNote: string;
    edit: string;
    delete: string;
    addNote: string;
    note: string;
    emptyTitle: string;
    emptyText: string;
    currentStreak: string;
    streakAfter: string;
    streakOf: string;
    noteUnmarked: string;
    noteAlcohol: string;
    noteFree: string;
    longest: string;
    seriesNote: string;
    thread: string;
    todayLabel: string;
    plateCaption: string;
    plateText: string;
  };

  cal: {
    modeMonth: string;
    modeYear: string;
    prevMonth: string;
    nextMonth: string;
    prevYear: string;
    nextYear: string;
    inMonth: string;
    inYear: string;
    yearLabel: string;
    summaryMonth: string;
    summaryYear: string;
    monthNote: string;
    yearHint: string;
    openMonth: string;
    tipFree: string;
    tipAlcohol: string;
    cellAria: string;
    futureSuffix: string;
    cFree: string;
    cAlcohol: string;
    cUnmarked: string;
  };

  stats: {
    rubric: string;
    week: string;
    month: string;
    year: string;
    last7: string;
    thisMonth: string;
    thisYear: string;
    yearN: string;
    total: string;
    shareTitle: string;
    shareFree: string;
    shareAlcohol: string;
    shareUnmarked: string;
    markedOf: string;
    restUnmarked: string;
    allMarked: string;
    eachWeek: string;
    eachMonth: string;
    hintWeek: string;
    hintMonth: string;
    byMonths: string;
    monthsCount: string;
    yearMap: string;
    mapHint: string;
    cellTitle: string;
    emptyTitle: string;
    emptyText: string;
  };

  settings: {
    appearance: string;
    language: string;
    langRu: string;
    langUk: string;
    langEn: string;
    nameLabel: string;
    namePlaceholder: string;
    storage: string;
    storageText: string;
    records: string;
    zeroServers: string;
    about: string;
    aboutText: string;
    manage: string;
    clearAll: string;
    clearHintEmpty: string;
    clearHint: string;
    confirmTitle: string;
    confirmText: string;
    yesDelete: string;
    cancel: string;
    deleted: string;
    footer: string;
  };

  editor: {
    dialogAria: string;
    close: string;
    closeWindow: string;
    markOfDay: string;
    futureText: string;
    understood: string;
    statusTitle: string;
    noteLabel: string;
    notePlaceholder: string;
    saveNew: string;
    saveEdit: string;
    changedNote: string;
  };
}

export const LOCALES: Locale[] = ["ru", "uk", "en"];

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  uk: "Українська",
  en: "English",
};

const ru: Dict = {
  tagline: "календарь дней",
  tab: { today: "Сегодня", calendar: "Календарь", stats: "Статистика", settings: "Настройки" },
  theme: {
    dark: "Тёмная",
    light: "Светлая",
    toLight: "Включить светлую тему",
    toDark: "Включить тёмную тему",
    nowDark: "Сейчас: тёмная тема",
    nowLight: "Сейчас: светлая тема",
  },
  status: { alcohol: "Алкоголь", alcohol_free: "Без алкоголя", unmarked: "Не отмечено" },
  statusLong: { alcohol: "Был алкоголь", alcohol_free: "Без алкоголя" },
  statusHint: {
    alcohol: "день отмечен как «был алкоголь»",
    alcohol_free: "день отмечен как «без алкоголя»",
  },
  legend: {
    title: "Легенда",
    alcohol: "вы отметили день с алкоголем",
    alcohol_free: "вы явно отметили день без алкоголя",
    unmarked: "записи нет — статус неизвестен",
  },
  today: {
    onDay: "Сегодня · {date}",
    markFree: "Отметить без алкоголя",
    markAlcohol: "Отметить алкоголь",
    unmarkedNote: "Сегодня пока не отмечено. Серия не считается, пока вы не отметите день.",
    edit: "Изменить отметку",
    delete: "Удалить отметку",
    addNote: "Добавить заметку к этому дню",
    note: "Заметка",
    emptyTitle: "История пока пуста",
    emptyText: "Это нормально. Отметьте сегодняшний день — и начнётся ваша хроника.",
    currentStreak: "Текущая подтверждённая серия",
    streakAfter: "подряд",
    streakOf: "отмечено без алкоголя",
    noteUnmarked: "Сегодня ещё не отмечено: серия посчитана по вашим отметкам до вчера включительно.",
    noteAlcohol:
      "Сегодня отмечено «алкоголь» — текущая серия равна нулю. Самая длинная серия из прошлого никуда не делась.",
    noteFree: "Сегодняшний день входит в серию.",
    longest: "Самая длинная серия за всё время",
    seriesNote:
      "Серия считается только по вашим отметкам: день без отметки её прерывает — приложение не гадает, что произошло. Это дневник наблюдений, а не медицинский инструмент.",
    thread: "Лента последних {n} дней",
    todayLabel: "сегодня · {date}",
    plateCaption: "Дневник без оценок",
    plateText:
      "Любая отметка — просто информация о прожитом дне, без «успехов» и «провалов».",
  },
  cal: {
    modeMonth: "Месяц",
    modeYear: "Год (12 месяцев)",
    prevMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    prevYear: "Предыдущий год",
    nextYear: "Следующий год",
    inMonth: "{n} {days} в месяце",
    inYear: "{n} {days} в году",
    yearLabel: "{y} год",
    summaryMonth: "Итог месяца",
    summaryYear: "Итог за {y} год",
    monthNote:
      "Неотмеченные дни — это просто отсутствие записи. Нажмите на любую прошедшую дату, чтобы добавить, изменить или удалить отметку.",
    yearHint:
      "Нажмите на название любого месяца, чтобы раскрыть его крупно, или нажмите прямо на прошедшую дату в годовой сетке, чтобы изменить отметку.",
    openMonth: "Открыть месяц {month} {y}",
    tipFree: "Дней без алкоголя",
    tipAlcohol: "Дней с алкоголем",
    cellAria: "{date}, {status}",
    futureSuffix: ", будущая дата",
    cFree: "без алкоголя",
    cAlcohol: "с алкоголем",
    cUnmarked: "не отмечено",
  },
  stats: {
    rubric: "Статистика по отметкам",
    week: "Неделя",
    month: "Месяц",
    year: "Год",
    last7: "последние 7 дней",
    thisMonth: "текущий месяц",
    thisYear: "текущий год",
    yearN: "{y} год",
    total: "{n} всего",
    shareTitle: "Доля периода",
    shareFree: "Без алкоголя — {p}%",
    shareAlcohol: "С алкоголем — {p}%",
    shareUnmarked: "Не отмечено — {p}%",
    markedOf: "Без алкоголя отмечено {free} {days} из {total}.",
    restUnmarked: "Ещё {n} {days} остались без отметки — они не считаются днями без алкоголя.",
    allMarked: "Все дни периода отмечены.",
    eachWeek: "Каждый день недели",
    eachMonth: "Каждый день месяца",
    hintWeek: "Листик — день без алкоголя, бутылочка — день с алкоголем, кольцо — день без отметки.",
    hintMonth: "Неделя идёт слева направо, понедельник — первый день.",
    byMonths: "По месяцам {y} года",
    monthsCount: "12 месяцев",
    yearMap: "Карта всех дней {y} года",
    mapHint:
      "Каждая строка — один месяц (с 1 по 31 число). Зелёная клетка — день без алкоголя, терракотовая — день с алкоголем, нейтральная — день без отметки.",
    cellTitle: "{date} — {status}",
    emptyTitle: "Отметок пока нет",
    emptyText:
      "Как только вы отметите первый день, здесь появятся числа. Сейчас все дни периода показаны как «не отмечено» — это не оценка, а просто отсутствие записи.",
  },
  settings: {
    appearance: "Оформление и название",
    language: "Язык интерфейса",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",
    nameLabel: "Название дневника в шапке",
    namePlaceholder: "Ясно",
    storage: "Где хранятся данные",
    storageText:
      "Серверная синхронизация в этом приложении не реализована. Все записи о днях хранятся только локально: в приложении на устройстве — в базе SQLite, в браузерной версии — в локальном хранилище. Никуда не отправляются, ни с кем не делятся, при переносе на другое устройство не переносятся.",
    records: "{days} с отметкой в истории",
    zeroServers: "серверов, аккаунтов и запросов в сеть",
    about: "О подсчётах",
    aboutText:
      "Приложение считает только то, что вы отметили сами: день попадает в серию исключительно при явной отметке «без алкоголя». Неотмеченный день прерывает серию — мы не делаем предположений о произошедшем. «{name}» — дневник наблюдений, а не медицинский инструмент: он не оценивает здоровье и не даёт рекомендаций.",
    manage: "Управление данными",
    clearAll: "Удалить всю историю",
    clearHintEmpty: "История пуста — удалять нечего.",
    clearHint:
      "Отметки, заметки и серии будут удалены с этого устройства без возможности вернуть.",
    confirmTitle: "Удалить всю историю?",
    confirmText: "Будут удалены {n} {days} с отметками и все заметки. Отменить это действие будет нельзя.",
    yesDelete: "Да, удалить",
    cancel: "Отмена",
    deleted: "История удалена. Приложение начинается с чистой страницы.",
    footer: "«{name}» · календарь дней без алкоголя · локальная версия 1.1",
  },
  editor: {
    dialogAria: "Редактирование отметки на {date}",
    close: "Закрыть",
    closeWindow: "Закрыть окно",
    markOfDay: "Отметка дня",
    futureText:
      "Будущие даты отмечать нельзя — отметка должна соответствовать прожитому дню. Здесь можно будет вернуться позже.",
    understood: "Понятно",
    statusTitle: "Статус дня",
    noteLabel: "Заметка — необязательно",
    notePlaceholder: "Например: вечер с друзьями, чувствовал себя спокойно",
    saveNew: "Сохранить отметку",
    saveEdit: "Сохранить изменения",
    changedNote: "Изменение или удаление отметки сразу пересчитывает серию.",
  },
};

const uk: Dict = {
  tagline: "календар днів",
  tab: { today: "Сьогодні", calendar: "Календар", stats: "Статистика", settings: "Налаштування" },
  theme: {
    dark: "Темна",
    light: "Світла",
    toLight: "Увімкнути світлу тему",
    toDark: "Увімкнути темну тему",
    nowDark: "Зараз: темна тема",
    nowLight: "Зараз: світла тема",
  },
  status: { alcohol: "Алкоголь", alcohol_free: "Без алкоголю", unmarked: "Не позначено" },
  statusLong: { alcohol: "Був алкоголь", alcohol_free: "Без алкоголю" },
  statusHint: {
    alcohol: "день позначено як «був алкоголь»",
    alcohol_free: "день позначено як «без алкоголю»",
  },
  legend: {
    title: "Легенда",
    alcohol: "ви позначили день з алкоголем",
    alcohol_free: "ви явно позначили день без алкоголю",
    unmarked: "запису немає — статус невідомий",
  },
  today: {
    onDay: "Сьогодні · {date}",
    markFree: "Позначити без алкоголю",
    markAlcohol: "Позначити алкоголь",
    unmarkedNote: "Сьогодні ще не позначено. Серія не рахується, поки ви не позначите день.",
    edit: "Змінити позначку",
    delete: "Видалити позначку",
    addNote: "Додати нотатку до цього дня",
    note: "Нотатка",
    emptyTitle: "Історія поки порожня",
    emptyText: "Це нормально. Позначте сьогоднішній день — і почнеться ваша хроніка.",
    currentStreak: "Поточна підтверджена серія",
    streakAfter: "поспіль",
    streakOf: "позначено без алкоголю",
    noteUnmarked:
      "Сьогодні ще не позначено: серію пораховано за вашими позначками до вчора включно.",
    noteAlcohol:
      "Сьогодні позначено «алкоголь» — поточна серія дорівнює нулю. Найдовша серія з минулого нікуди не поділася.",
    noteFree: "Сьогоднішній день входить у серію.",
    longest: "Найдовша серія за весь час",
    seriesNote:
      "Серія рахується лише за вашими позначками: день без позначки її перериває — застосунок не здогадується, що сталося. Це щоденник спостережень, а не медичний інструмент.",
    thread: "Стрічка останніх {n} днів",
    todayLabel: "сьогодні · {date}",
    plateCaption: "Щоденник без оцінок",
    plateText:
      "Будь-яка позначка — просто інформація про прожитий день, без «успіхів» і «провалів».",
  },
  cal: {
    modeMonth: "Місяць",
    modeYear: "Рік (12 місяців)",
    prevMonth: "Попередній місяць",
    nextMonth: "Наступний місяць",
    prevYear: "Попередній рік",
    nextYear: "Наступний рік",
    inMonth: "{n} {days} у місяці",
    inYear: "{n} {days} у році",
    yearLabel: "{y} рік",
    summaryMonth: "Підсумок місяця",
    summaryYear: "Підсумок за {y} рік",
    monthNote:
      "Непозначені дні — це просто відсутність запису. Натисніть на будь-яку минулу дату, щоб додати, змінити або видалити позначку.",
    yearHint:
      "Натисніть на назву будь-якого місяця, щоб розкрити його крупно, або натисніть прямо на минулу дату в річній сітці, щоб змінити позначку.",
    openMonth: "Відкрити місяць {month} {y}",
    tipFree: "Днів без алкоголю",
    tipAlcohol: "Днів з алкоголем",
    cellAria: "{date}, {status}",
    futureSuffix: ", майбутня дата",
    cFree: "без алкоголю",
    cAlcohol: "з алкоголем",
    cUnmarked: "не позначено",
  },
  stats: {
    rubric: "Статистика за позначками",
    week: "Тиждень",
    month: "Місяць",
    year: "Рік",
    last7: "останні 7 днів",
    thisMonth: "поточний місяць",
    thisYear: "поточний рік",
    yearN: "{y} рік",
    total: "{n} усього",
    shareTitle: "Частка періоду",
    shareFree: "Без алкоголю — {p}%",
    shareAlcohol: "З алкоголем — {p}%",
    shareUnmarked: "Не позначено — {p}%",
    markedOf: "Позначено без алкоголю: {free} {days} із {total}.",
    restUnmarked:
      "Ще {n} {days} лишилися без позначки — вони не вважаються днями без алкоголю.",
    allMarked: "Усі дні періоду позначено.",
    eachWeek: "Кожен день тижня",
    eachMonth: "Кожен день місяця",
    hintWeek: "Листок — день без алкоголю, пляшечка — день з алкоголем, кільце — день без позначки.",
    hintMonth: "Тиждень іде зліва направо, понеділок — перший день.",
    byMonths: "По місяцях {y} року",
    monthsCount: "12 місяців",
    yearMap: "Карта всіх днів {y} року",
    mapHint:
      "Кожен рядок — один місяць (з 1 по 31 число). Зелена клітинка — день без алкоголю, теракотова — день з алкоголем, нейтральна — день без позначки.",
    cellTitle: "{date} — {status}",
    emptyTitle: "Позначок поки немає",
    emptyText:
      "Щойно ви позначите перший день, тут з’являться числа. Наразі всі дні періоду показано як «не позначено» — це не оцінка, а просто відсутність запису.",
  },
  settings: {
    appearance: "Оформлення та назва",
    language: "Мова інтерфейсу",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",
    nameLabel: "Назва щоденника в шапці",
    namePlaceholder: "Ясно",
    storage: "Де зберігаються дані",
    storageText:
      "Серверна синхронізація в цьому застосунку не реалізована. Усі записи про дні зберігаються лише локально: у застосунку на пристрої — в базі SQLite, у браузерній версії — в локальному сховищі. Нікуди не надсилаються, ні з ким не діляться, при перенесенні на інший пристрій не переносяться.",
    records: "{days} з позначкою в історії",
    zeroServers: "серверів, акаунтів і запитів у мережу",
    about: "Про підрахунки",
    aboutText:
      "Застосунок рахує лише те, що ви позначили самі: день потрапляє в серію виключно за явною позначкою «без алкоголю». Непозначений день перериває серію — ми не робимо припущень про те, що сталося. «{name}» — щоденник спостережень, а не медичний інструмент: він не оцінює здоров’я і не дає рекомендацій.",
    manage: "Керування даними",
    clearAll: "Видалити всю історію",
    clearHintEmpty: "Історія порожня — видаляти нічого.",
    clearHint: "Позначки, нотатки та серії будуть видалені з цього пристрою без можливості повернути.",
    confirmTitle: "Видалити всю історію?",
    confirmText:
      "Буде видалено {n} {days} з позначками та всі нотатки. Скасувати цю дію буде неможливо.",
    yesDelete: "Так, видалити",
    cancel: "Скасувати",
    deleted: "Історію видалено. Застосунок починається з чистої сторінки.",
    footer: "«{name}» · календар днів без алкоголю · локальна версія 1.1",
  },
  editor: {
    dialogAria: "Редагування позначки на {date}",
    close: "Закрити",
    closeWindow: "Закрити вікно",
    markOfDay: "Позначка дня",
    futureText:
      "Майбутні дати позначати не можна — позначка має відповідати прожитому дню. Сюди можна буде повернутися пізніше.",
    understood: "Зрозуміло",
    statusTitle: "Статус дня",
    noteLabel: "Нотатка — необов’язково",
    notePlaceholder: "Наприклад: вечір із друзями, почувався спокійно",
    saveNew: "Зберегти позначку",
    saveEdit: "Зберегти зміни",
    changedNote: "Зміна або видалення позначки одразу перераховує серію.",
  },
};

const en: Dict = {
  tagline: "day calendar",
  tab: { today: "Today", calendar: "Calendar", stats: "Statistics", settings: "Settings" },
  theme: {
    dark: "Dark",
    light: "Light",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    nowDark: "Currently: dark theme",
    nowLight: "Currently: light theme",
  },
  status: { alcohol: "Alcohol", alcohol_free: "Alcohol-free", unmarked: "Not marked" },
  statusLong: { alcohol: "Had alcohol", alcohol_free: "Alcohol-free" },
  statusHint: {
    alcohol: "marked as a day with alcohol",
    alcohol_free: "marked as an alcohol-free day",
  },
  legend: {
    title: "Legend",
    alcohol: "you marked a day with alcohol",
    alcohol_free: "you explicitly marked an alcohol-free day",
    unmarked: "no record — the day is unknown",
  },
  today: {
    onDay: "Today · {date}",
    markFree: "Mark alcohol-free",
    markAlcohol: "Mark alcohol",
    unmarkedNote: "Today is not marked yet. The streak does not count until you mark the day.",
    edit: "Edit mark",
    delete: "Delete mark",
    addNote: "Add a note to this day",
    note: "Note",
    emptyTitle: "No history yet",
    emptyText: "That is fine. Mark today and your record begins.",
    currentStreak: "Current confirmed streak",
    streakAfter: "in a row",
    streakOf: "marked alcohol-free",
    noteUnmarked: "Today is not marked: the streak is counted from your marks up to yesterday.",
    noteAlcohol:
      "Today is marked as alcohol — the current streak is zero. The longest past streak is still yours.",
    noteFree: "Today is part of the streak.",
    longest: "Longest streak of all time",
    seriesNote:
      "A streak only counts your own marks: a day without a mark breaks it — the app does not guess what happened. This is a journal of observations, not a medical tool.",
    thread: "The last {n} days",
    todayLabel: "today · {date}",
    plateCaption: "A record without judgement",
    plateText: "Any mark is simply information about the day you lived — no wins, no failures.",
  },
  cal: {
    modeMonth: "Month",
    modeYear: "Year (12 months)",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    prevYear: "Previous year",
    nextYear: "Next year",
    inMonth: "{n} {days} in month",
    inYear: "{n} {days} in year",
    yearLabel: "{y}",
    summaryMonth: "Month summary",
    summaryYear: "Summary for {y}",
    monthNote:
      "Unmarked days are simply the absence of a record. Tap any past date to add, change or delete a mark.",
    yearHint:
      "Tap a month name to open it full size, or tap any past date in the year grid to change its mark.",
    openMonth: "Open month {month} {y}",
    tipFree: "Alcohol-free days",
    tipAlcohol: "Days with alcohol",
    cellAria: "{date}, {status}",
    futureSuffix: ", future date",
    cFree: "alcohol-free",
    cAlcohol: "with alcohol",
    cUnmarked: "not marked",
  },
  stats: {
    rubric: "Statistics from your marks",
    week: "Week",
    month: "Month",
    year: "Year",
    last7: "last 7 days",
    thisMonth: "this month",
    thisYear: "this year",
    yearN: "{y}",
    total: "{n} total",
    shareTitle: "Share of the period",
    shareFree: "Alcohol-free — {p}%",
    shareAlcohol: "With alcohol — {p}%",
    shareUnmarked: "Not marked — {p}%",
    markedOf: "Alcohol-free on {free} of {total} {days}.",
    restUnmarked: "{n} {days} still have no mark — they are not counted as alcohol-free.",
    allMarked: "Every day in the period is marked.",
    eachWeek: "Every day of the week",
    eachMonth: "Every day of the month",
    hintWeek: "Leaf — alcohol-free day, bottle — day with alcohol, ring — unmarked day.",
    hintMonth: "The week runs left to right; Monday is the first day.",
    byMonths: "By month, {y}",
    monthsCount: "12 months",
    yearMap: "Map of every day in {y}",
    mapHint:
      "Each row is one month (days 1–31). Green cell — alcohol-free day, terracotta — day with alcohol, neutral — unmarked day.",
    cellTitle: "{date} — {status}",
    emptyTitle: "No marks yet",
    emptyText:
      "As soon as you mark your first day, the numbers will appear. For now every day of the period shows as “not marked” — that is not a judgement, just the absence of a record.",
  },
  settings: {
    appearance: "Appearance and name",
    language: "Interface language",
    langRu: "Русский",
    langUk: "Українська",
    langEn: "English",
    nameLabel: "Journal name in the header",
    namePlaceholder: "Clear",
    storage: "Where your data lives",
    storageText:
      "Server sync is not implemented in this app. Every record is stored only locally: in the on-device app — in an SQLite database, in the browser version — in local storage. Nothing is sent anywhere, shared with anyone, or carried over to another device.",
    records: "{days} marked in history",
    zeroServers: "servers, accounts or network requests",
    about: "How counting works",
    aboutText:
      "The app counts only what you marked yourself: a day joins the streak only with an explicit “alcohol-free” mark. An unmarked day breaks the streak — we do not guess what happened. “{name}” is a journal of observations, not a medical tool: it does not assess health and gives no advice.",
    manage: "Data management",
    clearAll: "Delete all history",
    clearHintEmpty: "The history is empty — nothing to delete.",
    clearHint: "Marks, notes and streaks will be removed from this device and cannot be restored.",
    confirmTitle: "Delete all history?",
    confirmText:
      "{n} {days} with marks and all notes will be removed. This action cannot be undone.",
    yesDelete: "Yes, delete",
    cancel: "Cancel",
    deleted: "History deleted. The app starts from a clean page.",
    footer: "“{name}” · alcohol-free day calendar · local version 1.1",
  },
  editor: {
    dialogAria: "Editing the mark for {date}",
    close: "Close",
    closeWindow: "Close window",
    markOfDay: "Mark for this day",
    futureText:
      "Future dates cannot be marked — a mark must match a day that actually happened. You can come back later.",
    understood: "Got it",
    statusTitle: "Day status",
    noteLabel: "Note — optional",
    notePlaceholder: "For example: evening with friends, felt calm",
    saveNew: "Save mark",
    saveEdit: "Save changes",
    changedNote: "Changing or deleting a mark recalculates the streak right away.",
  },
};

export const DICT: Record<Locale, Dict> = { ru, uk, en };

export function getDict(locale: Locale): Dict {
  return DICT[locale] ?? DICT.ru;
}

/** Простая подстановка `{key}` в шаблоне. */
export function fmt(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
  );
}
