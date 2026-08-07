// ⚠️ ПЕРЕВОД НЕ ВЫЧИТАН ЗАКАЗЧИКОМ. Требует правки перед показом клиенту.
//
// Ключи совпадают с ru.ts. Имена собственные (названия отелей, названия точек
// в витринах) не переводятся — они остаются как в оригинале.
import type { Dict } from '@/composables/useI18n'

export const en: Dict = {
  // Navigation
  'nav.calc': 'Estimate',
  'nav.routes': 'Routes',
  'nav.stay': 'Stay',
  'nav.food': 'Meals',

  // Plurals: English has two forms
  'u.person': ['person', 'people'],
  'u.night': ['night', 'nights'],
  'u.day': ['day', 'days'],
  'u.city': ['city', 'cities'],
  'u.meal': ['meal', 'meals'],

  // Estimate screen
  'calc.who': 'Who is travelling',
  'calc.cities': 'Cities',
  'calc.pickDates': 'Choose dates',
  'calc.change': 'Change',
  'calc.pickTariff': 'Choose a tariff',
  'calc.trip': 'Trip {range} · {days} · {cities}',
  'calc.minusPerson': 'Remove a person',
  'calc.plusPerson': 'Add a person',

  // Levels
  'level.econom': 'Economy',
  'level.medium': 'Standard',
  'level.lux': 'Luxury',

  // Cities
  'city.tashkent': 'Tashkent',
  'city.samarkand': 'Samarkand',
  'city.bukhara': 'Bukhara',
  'city.khiva': 'Khiva',

  // Tariff card
  'tariff.per': 'for {days} / person',
  'tariff.selected': 'Selected',

  // Total panel
  'total.perPerson': 'per person',
  'total.forGroup': 'group of {n}:',
  'total.discount': 'Group discount',
  'total.saving': 'you save',
  'total.nudge': '+{n} {people} — {rate} discount',
  'total.byArticles': 'Breakdown',
  'total.byCities': 'By city',
  'total.empty': 'Choose dates and a tariff in at least one city.',
  'total.reset': 'Reset',
  'total.share': 'Copy the estimate',
  'total.copied': 'Copied',

  // Line items
  'art.stay': 'Accommodation',
  'art.food': 'Meals',
  'art.guide': 'Guide and tours',
  'art.transfers': 'Transfers',
  'art.fee': 'Service fee',
  'art.discount': 'Group discount {rate}',

  // Clipboard summary
  'share.title': 'YOLI — preliminary estimate for a trip across Uzbekistan',
  'share.people': 'People: {n}',
  'share.route': 'Route:',
  'share.total': 'Total for the group: {sum}',
  'share.perPerson': 'Per person: {sum}',
  'share.note': 'Prices are preliminary and are not an offer.',

  // Calendar
  'dates.title': 'Dates · {city}',
  'dates.pickIn': 'Choose the check-in day',
  'dates.pickOut': 'Check-in {date} · choose the check-out day',
  'dates.done': 'Done',
  'dates.doneWith': 'Done · {range}',
  'dates.remove': 'Remove city',
  'dates.busy': 'Taken: {city}',
  'dates.weekdays': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  'dates.monthsGen': [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  'dates.monthsNom': [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],

  // Date part order
  'dates.dayMonth': '{day} {month}',
  'dates.rangeSameMonth': '{from}–{to} {month}',
  'dates.monthTitle': '{month} {year}',

  // Bottom sheets
  'sheet.close': 'Close',
  'sheet.tariff': '{name} tariff',
  'sheet.others': 'Other tariffs',
  'sheet.choose': 'Choose this tariff',
  'sheet.pending': 'Details to be confirmed.',

  // Inclusion items
  'inc.hotel': 'Hotel',
  'inc.food': 'Meals',
  'inc.transfer': 'Transfer',
  'inc.logistics': 'Logistics and routes',
  'inc.guide': 'Local guide',

  // Transfer
  'transfer.car.econom': 'Nexia or Lacetti',
  'transfer.car.medium': 'Malibu or similar',
  'transfer.car.lux': 'H-1 minivan or executive class',
  'transfer.carLine': 'Car class: {car}',
  'transfer.d1': 'Driver who speaks Russian and knows the roads, rating 4.5+',
  'transfer.d2': 'Fuel for the whole route',
  'transfer.d3': 'Bottled water in the car',
  'transfer.d4': 'Air conditioning',
  'transfer.d5': 'Wi-Fi where the car has it',
  'transfer.d6': 'Help with translation: at a restaurant, at a petrol station',
  'transfer.d7': 'Up to three stops of 30–40 minutes: rest, teahouse',
  'transfer.d8': 'Not included: museum tickets, food and drinks for passengers',

  // Logistics
  'logistics.summary': 'Driver-guide for the whole route, flexible plan',
  'logistics.d1': 'A driver-guide accompanies the whole route',
  'logistics.d2': 'Flexible route: the plan can change every day',
  'logistics.d3': 'Unlimited stops',
  'logistics.d4': 'Driver recommendations: places and venues along the way',
  'logistics.d5': 'Route changes are recalculated with no penalty',
  'logistics.d6': 'Not included: driver accommodation on multi-day rentals',

  // Hotel
  'hotel.title': 'Hotel · {city}',

  'hotel.cat.econom': '2–3★ hotel',
  'hotel.cat.medium': '3–4★ hotel',
  'hotel.cat.lux': '4–5★ hotel',
  'hotel.catName.econom': 'Economy',
  'hotel.catName.medium': 'Standard class',
  'hotel.catName.lux': 'Luxury',
  'hotel.note': 'The particular hotel is selected once the booking is confirmed. We guarantee the category and the conditions listed above.',
  'hotel.benefit.econom.1': 'Located within the city, with easy access to the main routes',
  'hotel.benefit.econom.2': 'A private room with its own bathroom',
  'hotel.benefit.econom.3': 'Air conditioning in the room',
  'hotel.benefit.econom.4': 'Breakfast included',
  'hotel.benefit.econom.5': 'Daily cleaning, linen changed on the hotel schedule',
  'hotel.benefit.econom.6': 'Wi-Fi on the premises',
  'hotel.benefit.econom.7': 'Reception during working hours',
  'hotel.benefit.econom.8': 'Luggage storage before check-in and after check-out',
  'hotel.benefit.medium.1': 'Located in the tourist part of the city, key sights within walking distance',
  'hotel.benefit.medium.2': 'A spacious room of higher comfort',
  'hotel.benefit.medium.3': 'Air conditioning, TV, work desk, safe',
  'hotel.benefit.medium.4': 'Extended buffet breakfast',
  'hotel.benefit.medium.5': 'Restaurant or cafe on the premises',
  'hotel.benefit.medium.6': 'Fitness area or swimming pool',
  'hotel.benefit.medium.7': 'Daily cleaning and linen change',
  'hotel.benefit.medium.8': 'Wi-Fi throughout the premises',
  'hotel.benefit.medium.9': 'Reception around the clock',
  'hotel.benefit.medium.10': 'Luggage storage, assistance with transport',
  'hotel.benefit.lux.1': 'Located in the central part of the city, within walking distance of the main sights',
  'hotel.benefit.lux.2': 'A top-category room or junior suite, larger floor area',
  'hotel.benefit.lux.3': 'Fully equipped room: air conditioning, safe, minibar, seating area',
  'hotel.benefit.lux.4': 'Premium breakfast, a restaurant or several dining options on the premises',
  'hotel.benefit.lux.5': 'Swimming pool, spa area or relaxation area',
  'hotel.benefit.lux.6': 'Room service and concierge service',
  'hotel.benefit.lux.7': 'Cleaning twice a day, daily linen change',
  'hotel.benefit.lux.8': 'Early check-in and late check-out where the hotel can offer it',
  'hotel.benefit.lux.9': 'Welcome set on arrival',
  'hotel.benefit.lux.10': 'Personal assistance throughout the stay',

  // Meals
  'meal.title': 'Meals · {city}',
  'meal.byDays': 'Day by day',
  'meal.day': 'Day {n} · {date}',
  'meal.breakfast': 'Breakfast',
  'meal.lunch': 'Lunch',
  'meal.dinner': 'Dinner',
  'meal.venues.econom': 'City cafes and teahouses',
  'meal.venues.medium': 'Restaurants with national and European menus',
  'meal.venues.lux': 'Signature and rooftop restaurants, dinner with a programme',
  'cuisine.uzbek': 'Uzbek cuisine',
  'cuisine.chinese': 'Chinese cuisine',
  'cuisine.russian': 'Russian cuisine',
  'cuisine.japanese': 'Japanese cuisine',
  'course.first': 'Starter',
  'course.second': 'Main',
  'course.table': 'To share',
  'dish.mastava': 'Mastava',
  'dish.plov': 'Plov',
  'dish.samsa': 'Samsa',
  'dish.shashlik': 'Shashlik',

  // Gifts
  'bonus.title': 'Included as a gift',
  'bonus.dedBobo': 'Ded Bobo',
  'bonus.translator': 'Interpreter',
  'bonus.audio': 'Audio guide',
  'bonus.routes': 'Routes',
  'bonus.hours3': '3 hours',
  'bonus.hours7': '7 hours',
  'bonus.unlimited': 'unlimited',

  // Showcases
  'showcase.routes.title': 'Routes',
  'showcase.routes.note': 'Points from the programme. Full descriptions are in progress.',
  'showcase.routes.text': 'A point from the programme. Description in progress.',
  'showcase.stay.title': 'Stay',
  'showcase.stay.note': 'Accommodation categories by city along the route.',
  'showcase.stay.text': 'Hotels of the 2–3★, 3–4★ and 4–5★ categories. The category and its conditions are guaranteed.',
  'showcase.food.title': 'Meals',
  'showcase.food.note': 'Meals by city along the route. Menus to be confirmed.',
  'showcase.food.text': 'Meals as per the programme. Menus and venues to be confirmed.',
}
