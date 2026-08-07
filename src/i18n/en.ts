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
  'u.star': ['star', 'stars'],

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
  'hotel.amenities': 'Amenities',
  'hotel.others': 'Other hotels of this level',
  'hotel.cat.econom': '3★, guesthouse or hotel within walking distance of the centre',
  'hotel.cat.medium': '4★ in the city centre',
  'hotel.cat.lux': '5★ or a boutique hotel in the historic quarter',
  'hotel.catShort.econom': '3★, near the centre',
  'hotel.catShort.medium': '4★, city centre',
  'hotel.catShort.lux': '5★ or boutique hotel',

  // Tashkent areas
  'hotel.area.tasCenter': 'City centre',
  'hotel.area.tasAmirTemur': 'City centre, by Amir Temur square',
  'hotel.area.tasMirabad': 'Mirabad district',
  'hotel.area.tasYunusabad': 'Yunusabad district',
  'hotel.area.tasCity': 'Tashkent City',

  // Service descriptions
  'hotel.service.tasUzbekistan':
    'A large city hotel a step away from the main squares. Basic service, front desk around the clock.',
  'hotel.service.tasShodlik':
    'A quiet hotel in the centre, away from the main roads. Simple city accommodation.',
  'hotel.service.tasOrzu':
    'A small hotel in a residential area closer to the railway station. Basic service, quiet rooms.',
  'hotel.service.tasLotte':
    'An international chain hotel in the centre. Consistent service, front desk and breakfast included.',
  'hotel.service.tasRamada':
    'A business-format chain hotel. Predictable service, convenient for groups.',
  'hotel.service.tasGrandMir':
    'A city hotel in the centre with its own grounds. Attentive service, quiet rooms.',
  'hotel.service.tasInternational':
    'A large hotel in the business part of the city. Suited to groups and business trips.',
  'hotel.service.tasCityPalace':
    'A hotel in the centre next to transport hubs. Standard service for its level.',
  'hotel.service.tasHyatt':
    'A high-category hotel in the new business quarter. Personal service, spacious rooms.',
  'hotel.service.tasHilton':
    'An international chain hotel in Tashkent City. High level of service, modern rooms.',

  // Amenities
  'am.wifi': 'Wi-Fi',
  'am.breakfast': 'Breakfast',
  'am.ac': 'Air conditioning',
  'am.hairdryer': 'Hairdryer',
  'am.safe': 'Safe',
  'am.shower': 'Shower',
  'am.bath': 'Bathtub',
  'am.cleaning': 'Daily cleaning',
  'am.reception': '24/7 reception',
  'am.robe': 'Robe and slippers',
  'am.roomService': 'Room service',

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
  'showcase.stay.note': 'Accommodation categories by city. Hotels to be confirmed.',
  'showcase.stay.text':
    'Economy, standard and luxury accommodation. Hotel list to be confirmed.',
  'showcase.food.title': 'Meals',
  'showcase.food.note': 'Meals by city along the route. Menus to be confirmed.',
  'showcase.food.text': 'Meals as per the programme. Menus and venues to be confirmed.',
}
