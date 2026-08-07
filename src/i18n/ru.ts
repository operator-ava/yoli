// Русские строки. Ключи здесь и в en.ts совпадают.
import type { Dict } from '@/composables/useI18n'

export const ru: Dict = {
  // Навигация
  'nav.calc': 'Расчёт',
  'nav.routes': 'Маршруты',
  'nav.stay': 'Проживание',
  'nav.food': 'Питание',

  // Числительные
  'u.person': ['человек', 'человека', 'человек'],
  'u.night': ['ночь', 'ночи', 'ночей'],
  'u.day': ['день', 'дня', 'дней'],
  'u.city': ['город', 'города', 'городов'],
  'u.meal': ['приём пищи', 'приёма пищи', 'приёмов пищи'],
  'u.star': ['звезда', 'звезды', 'звёзд'],

  // Экран расчёта
  'calc.who': 'Кто едет',
  'calc.cities': 'Города',
  'calc.pickDates': 'Выберите даты',
  'calc.change': 'Изменить',
  'calc.pickTariff': 'Выберите тариф',
  'calc.trip': 'Поездка {range} · {days} · {cities}',
  'calc.minusPerson': 'Убрать человека',
  'calc.plusPerson': 'Добавить человека',

  // Уровни
  'level.econom': 'Эконом',
  'level.medium': 'Средний',
  'level.lux': 'Люкс',

  // Города
  'city.tashkent': 'Ташкент',
  'city.samarkand': 'Самарканд',
  'city.bukhara': 'Бухара',
  'city.khiva': 'Хива',

  // Карточка тарифа
  'tariff.per': 'за {days} / чел',
  'tariff.selected': 'Выбран',

  // Панель итога
  'total.perPerson': 'на человека',
  'total.forGroup': 'за группу из {n}:',
  'total.discount': 'Скидка группы',
  'total.saving': 'вы экономите',
  'total.nudge': '+{n} {people} — скидка {rate}',
  'total.byArticles': 'По статьям',
  'total.byCities': 'По городам',
  'total.empty': 'Выберите даты и тариф хотя бы в одном городе.',
  'total.reset': 'Сбросить',
  'total.share': 'Поделиться расчётом',
  'total.copied': 'Скопировано',

  // Статьи
  'art.stay': 'Проживание',
  'art.food': 'Питание',
  'art.guide': 'Гид и экскурсии',
  'art.transfers': 'Переезды',
  'art.fee': 'Сервисный сбор',
  'art.discount': 'Скидка группы {rate}',

  // Текстовая сводка в буфер
  'share.title': 'YOLI — предварительный расчёт путешествия по Узбекистану',
  'share.people': 'Человек: {n}',
  'share.route': 'Маршрут:',
  'share.total': 'Итого за группу: {sum}',
  'share.perPerson': 'На человека: {sum}',
  'share.note': 'Цены предварительные, не являются офертой.',

  // Календарь
  'dates.title': 'Даты · {city}',
  'dates.pickIn': 'Выберите день заезда',
  'dates.pickOut': 'Заезд {date} · выберите день выезда',
  'dates.done': 'Готово',
  'dates.doneWith': 'Готово · {range}',
  'dates.remove': 'Убрать город',
  'dates.busy': 'Занято: {city}',
  'dates.weekdays': ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
  'dates.monthsGen': [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
  'dates.monthsNom': [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],

  // Порядок частей даты
  'dates.dayMonth': '{day} {month}',
  'dates.rangeSameMonth': '{from}–{to} {month}',
  'dates.monthTitle': '{month} {year}',

  // Нижние листы
  'sheet.close': 'Закрыть',
  'sheet.tariff': 'Тариф «{name}»',
  'sheet.others': 'В других тарифах',
  'sheet.choose': 'Выбрать этот тариф',
  'sheet.pending': 'Состав уточняется.',

  // Пункты состава
  'inc.hotel': 'Гостиница',
  'inc.food': 'Питание',
  'inc.transfer': 'Трансфер',
  'inc.logistics': 'Логистика и маршруты',
  'inc.guide': 'Живой гид',

  // Трансфер
  'transfer.car.econom': 'Nexia или Lacetti',
  'transfer.car.medium': 'Malibu или аналог',
  'transfer.car.lux': 'Минивэн H-1 или представительский класс',
  'transfer.carLine': 'Класс автомобиля: {car}',
  'transfer.d1': 'Водитель со знанием русского языка и дорог, рейтинг 4.5+',
  'transfer.d2': 'Бензин на весь маршрут',
  'transfer.d3': 'Бутилированная вода в машине',
  'transfer.d4': 'Кондиционер',
  'transfer.d5': 'Wi-Fi, если доступен в машине',
  'transfer.d6': 'Помощь с переводом: в ресторане, на заправке',
  'transfer.d7': 'До трёх остановок по 30–40 минут: отдых, чайхана',
  'transfer.d8': 'Не входит: входные билеты в музеи, еда и напитки пассажиров',

  // Логистика
  'logistics.summary': 'Водитель-гид на весь маршрут, гибкий план',
  'logistics.d1': 'Водитель-гид сопровождает весь маршрут',
  'logistics.d2': 'Гибкий маршрут: план можно менять каждый день',
  'logistics.d3': 'Остановки без ограничений',
  'logistics.d4': 'Рекомендации водителя: места и заведения по пути',
  'logistics.d5': 'Изменение маршрута в процессе пересчитывается без штрафов',
  'logistics.d6': 'Не входит: ночёвка водителя при многодневной аренде',

  // Гостиница
  'hotel.title': 'Гостиница · {city}',
  'hotel.amenities': 'Удобства',
  'hotel.others': 'Другие отели этого уровня',
  'hotel.cat.econom': '3★, гостевой дом или отель в шаговой доступности от центра',
  'hotel.cat.medium': '4★ в центре города',
  'hotel.cat.lux': '5★ или бутик-отель исторического квартала',
  'hotel.catShort.econom': '3★, рядом с центром',
  'hotel.catShort.medium': '4★, центр города',
  'hotel.catShort.lux': '5★ или бутик-отель',

  // Районы Ташкента
  'hotel.area.tasCenter': 'Центр',
  'hotel.area.tasAmirTemur': 'Центр, у сквера Амира Темура',
  'hotel.area.tasMirabad': 'Мирабадский район',
  'hotel.area.tasYunusabad': 'Юнусабадский район',
  'hotel.area.tasCity': 'Ташкент-Сити',

  // Описание обслуживания
  'hotel.service.tasUzbekistan':
    'Крупная городская гостиница в шаге от главных площадей. Обслуживание базовое, круглосуточная стойка.',
  'hotel.service.tasShodlik':
    'Спокойный отель в центре, в стороне от основных магистралей. Формат — простое городское размещение.',
  'hotel.service.tasOrzu':
    'Небольшой отель в жилом районе, ближе к вокзалу. Обслуживание базовое, размещение тихое.',
  'hotel.service.tasLotte':
    'Отель международной сети в центре. Ровный уровень обслуживания, стойка и завтрак включены.',
  'hotel.service.tasRamada':
    'Сетевой отель делового формата. Обслуживание предсказуемое, удобно для групп.',
  'hotel.service.tasGrandMir':
    'Городской отель в центре с собственной территорией. Обслуживание внимательное, размещение спокойное.',
  'hotel.service.tasInternational':
    'Крупный отель в деловой части города. Формат — размещение для групп и деловых поездок.',
  'hotel.service.tasCityPalace':
    'Отель в центре рядом с транспортными узлами. Обслуживание стандартное для своего уровня.',
  'hotel.service.tasHyatt':
    'Отель высокой категории в новом деловом квартале. Обслуживание персональное, размещение просторное.',
  'hotel.service.tasHilton':
    'Отель международной сети в Ташкент-Сити. Обслуживание высокого уровня, размещение современное.',

  // Удобства
  'am.wifi': 'Wi-Fi',
  'am.breakfast': 'Завтрак',
  'am.ac': 'Кондиционер',
  'am.hairdryer': 'Фен',
  'am.safe': 'Сейф',
  'am.shower': 'Душ',
  'am.bath': 'Ванна',
  'am.cleaning': 'Ежедневная уборка',
  'am.reception': 'Ресепшн 24/7',
  'am.robe': 'Халат и тапочки',
  'am.roomService': 'Обслуживание номеров',

  // Питание
  'meal.title': 'Питание · {city}',
  'meal.byDays': 'По дням',
  'meal.day': 'День {n} · {date}',
  'meal.breakfast': 'Завтрак',
  'meal.lunch': 'Обед',
  'meal.dinner': 'Ужин',
  'meal.venues.econom': 'Кафе и чайханы городского формата',
  'meal.venues.medium': 'Рестораны с национальной и европейской картой',
  'meal.venues.lux': 'Авторские и панорамные рестораны, ужин с программой',
  'cuisine.uzbek': 'Узбекская кухня',
  'cuisine.chinese': 'Китайская кухня',
  'cuisine.russian': 'Русская кухня',
  'cuisine.japanese': 'Японская кухня',
  'course.first': 'Первое',
  'course.second': 'Второе',
  'course.table': 'К столу',
  'dish.mastava': 'Мастава',
  'dish.plov': 'Плов',
  'dish.samsa': 'Самса',
  'dish.shashlik': 'Шашлык',

  // Подарки
  'bonus.title': 'В подарок',
  'bonus.dedBobo': 'Дед Бобо',
  'bonus.translator': 'Переводчик',
  'bonus.audio': 'Аудиогид',
  'bonus.routes': 'Маршруты',
  'bonus.hours3': '3 часа',
  'bonus.hours7': '7 часов',
  'bonus.unlimited': 'без лимита',

  // Витрины
  'showcase.routes.title': 'Маршруты',
  'showcase.routes.note': 'Точки из программы. Полные описания готовятся.',
  'showcase.routes.text': 'Точка из программы. Описание готовится.',
  'showcase.stay.title': 'Проживание',
  'showcase.stay.note': 'Категории размещения по городам. Отели — после согласования.',
  'showcase.stay.text': 'Размещение уровней эконом, средний и люкс. Список отелей — после согласования.',
  'showcase.food.title': 'Питание',
  'showcase.food.note': 'Питание по городам маршрута. Меню — после согласования.',
  'showcase.food.text': 'Питание по программе. Меню и заведения — после согласования.',
}
