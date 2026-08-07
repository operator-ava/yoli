// ⚠️ ПЕРЕВОД НЕ ВЫЧИТАН ЗАКАЗЧИКОМ. Требует правки перед показом клиенту.
//
// Упрощённый китайский (материковый). Ключи совпадают с ru.ts и en.ts.
// Имена собственные (названия отелей, названия точек в витринах) не переводятся.
import type { Dict } from '@/composables/useI18n'

export const zh: Dict = {
  // 导航
  'nav.calc': '估算',
  'nav.routes': '路线',
  'nav.stay': '住宿',
  'nav.food': '餐饮',

  // 量词: 中文不区分单复数, форма одна
  'u.person': ['人'],
  'u.night': ['晚'],
  'u.day': ['天'],
  'u.city': ['座城市'],
  'u.meal': ['餐'],
  'u.star': ['星'],

  // 估算页面
  'calc.who': '出行人数',
  'calc.cities': '城市',
  'calc.pickDates': '请选择日期',
  'calc.change': '修改',
  'calc.pickTariff': '请选择套餐',
  'calc.trip': '行程 {range} · {days} · {cities}',
  'calc.minusPerson': '减少一人',
  'calc.plusPerson': '增加一人',

  // 套餐级别
  'level.econom': '经济',
  'level.medium': '标准',
  'level.lux': '豪华',

  // 城市
  'city.tashkent': '塔什干',
  'city.samarkand': '撒马尔罕',
  'city.bukhara': '布哈拉',
  'city.khiva': '希瓦',

  // 套餐卡片
  'tariff.per': '{days} / 每人',
  'tariff.selected': '已选择',

  // 合计面板
  'total.perPerson': '每人',
  'total.forGroup': '{n} 人团队：',
  'total.discount': '团队折扣',
  'total.saving': '为您节省',
  'total.nudge': '再加 {n} {people} — 折扣 {rate}',
  'total.byArticles': '费用明细',
  'total.byCities': '按城市',
  'total.empty': '请至少为一座城市选择日期和套餐。',
  'total.reset': '重置',
  'total.share': '复制报价',
  'total.copied': '已复制',

  // 费用项目
  'art.stay': '住宿',
  'art.food': '餐饮',
  'art.guide': '导游与游览',
  'art.transfers': '城际交通',
  'art.fee': '服务费',
  'art.discount': '团队折扣 {rate}',

  // 复制到剪贴板的文本
  'share.title': 'YOLI — 乌兹别克斯坦行程初步报价',
  'share.people': '人数：{n}',
  'share.route': '行程路线：',
  'share.total': '团队合计：{sum}',
  'share.perPerson': '每人：{sum}',
  'share.note': '价格为初步估算，不构成要约。',

  // 日历
  'dates.title': '日期 · {city}',
  'dates.pickIn': '请选择入住日期',
  'dates.pickOut': '入住 {date} · 请选择退房日期',
  'dates.done': '完成',
  'dates.doneWith': '完成 · {range}',
  'dates.remove': '移除该城市',
  'dates.busy': '已被占用：{city}',
  'dates.weekdays': ['一', '二', '三', '四', '五', '六', '日'],
  'dates.monthsGen': [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  'dates.monthsNom': [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  // Порядок частей даты в китайском обратный: сначала месяц, потом число
  'dates.dayMonth': '{month}{day}日',
  'dates.rangeSameMonth': '{month}{from}日–{to}日',
  'dates.monthTitle': '{year}年{month}',

  // 底部弹层
  'sheet.close': '关闭',
  'sheet.tariff': '{name}套餐',
  'sheet.others': '其他套餐',
  'sheet.choose': '选择此套餐',
  'sheet.pending': '内容待确认。',

  // 套餐内容
  'inc.hotel': '酒店',
  'inc.food': '餐饮',
  'inc.transfer': '接送用车',
  'inc.logistics': '行程与用车安排',
  'inc.guide': '当地导游',

  // 用车
  'transfer.car.econom': 'Nexia 或 Lacetti',
  'transfer.car.medium': 'Malibu 或同级车型',
  'transfer.car.lux': 'H-1 商务车或行政级车型',
  'transfer.carLine': '车型等级：{car}',
  'transfer.d1': '会讲俄语、熟悉路况的司机，评分 4.5 分以上',
  'transfer.d2': '全程油费',
  'transfer.d3': '车内瓶装饮用水',
  'transfer.d4': '空调',
  'transfer.d5': '车内如配备则提供 Wi-Fi',
  'transfer.d6': '翻译协助：餐厅、加油站等场合',
  'transfer.d7': '最多三次 30–40 分钟停靠：休息、茶馆',
  'transfer.d8': '不含：博物馆门票、乘客的餐饮',

  // 行程与用车安排
  'logistics.summary': '全程司机兼导游，行程灵活',
  'logistics.d1': '司机兼导游全程陪同',
  'logistics.d2': '行程灵活，每日均可调整',
  'logistics.d3': '停靠次数不限',
  'logistics.d4': '司机推荐沿途值得一去的地点',
  'logistics.d5': '行程变更据实重新计算，不收罚金',
  'logistics.d6': '不含：多日租车时司机的住宿',

  // 酒店
  'hotel.title': '酒店 · {city}',
  'hotel.amenities': '设施与服务',
  'hotel.others': '同级别的其他酒店',
  'hotel.cat.econom': '三星级，民宿或步行可达市中心的酒店',
  'hotel.cat.medium': '市中心四星级酒店',
  'hotel.cat.lux': '五星级或历史街区精品酒店',
  'hotel.catShort.econom': '三星级，邻近市中心',
  'hotel.catShort.medium': '四星级，市中心',
  'hotel.catShort.lux': '五星级或精品酒店',

  // 塔什干各区
  'hotel.area.tasCenter': '市中心',
  'hotel.area.tasAmirTemur': '市中心，帖木儿广场附近',
  'hotel.area.tasMirabad': '米拉巴德区',
  'hotel.area.tasYunusabad': '尤努萨巴德区',
  'hotel.area.tasCity': '塔什干城',

  // 服务说明
  'hotel.service.tasUzbekistan':
    '位于主要广场旁的大型城市酒店。服务为基础水准，前台 24 小时值守。',
  'hotel.service.tasShodlik': '市中心的安静酒店，远离主干道。属于简约的城市住宿。',
  'hotel.service.tasOrzu': '住宅区内的小型酒店，靠近火车站。服务为基础水准，环境安静。',
  'hotel.service.tasLotte': '市中心的国际连锁酒店。服务水准稳定，含前台服务与早餐。',
  'hotel.service.tasRamada': '商务型连锁酒店。服务规范，适合团队入住。',
  'hotel.service.tasGrandMir': '市中心酒店，设有独立庭院。服务细致，环境安静。',
  'hotel.service.tasInternational': '位于商务区的大型酒店。适合团队与商务出行。',
  'hotel.service.tasCityPalace': '市中心酒店，紧邻交通枢纽。服务符合该级别的常规水准。',
  'hotel.service.tasHyatt': '新商务区的高端酒店。服务贴心，客房宽敞。',
  'hotel.service.tasHilton': '塔什干城的国际连锁酒店。服务水准高，客房现代。',

  // 设施
  'am.wifi': 'Wi-Fi',
  'am.breakfast': '早餐',
  'am.ac': '空调',
  'am.hairdryer': '吹风机',
  'am.safe': '保险箱',
  'am.shower': '淋浴',
  'am.bath': '浴缸',
  'am.cleaning': '每日清洁',
  'am.reception': '24 小时前台',
  'am.robe': '浴袍与拖鞋',
  'am.roomService': '客房服务',

  // 餐饮
  'meal.title': '餐饮 · {city}',
  'meal.byDays': '每日安排',
  'meal.day': '第 {n} 天 · {date}',
  'meal.breakfast': '早餐',
  'meal.lunch': '午餐',
  'meal.dinner': '晚餐',
  'meal.venues.econom': '城市咖啡馆与茶馆',
  'meal.venues.medium': '提供本地与欧陆菜式的餐厅',
  'meal.venues.lux': '主厨餐厅与景观餐厅，晚餐含表演',
  'cuisine.uzbek': '乌兹别克菜',
  'cuisine.chinese': '中餐',
  'cuisine.russian': '俄餐',
  'cuisine.japanese': '日料',
  'course.first': '头道菜',
  'course.second': '主菜',
  'course.table': '佐餐',
  'dish.mastava': '马斯塔瓦汤',
  'dish.plov': '手抓饭',
  'dish.samsa': '萨姆萨烤包',
  'dish.shashlik': '烤肉串',

  // 赠送
  'bonus.title': '赠送内容',
  'bonus.dedBobo': '波波爷爷',
  'bonus.translator': '翻译服务',
  'bonus.audio': '语音导览',
  'bonus.routes': '路线',
  'bonus.hours3': '3 小时',
  'bonus.hours7': '7 小时',
  'bonus.unlimited': '不限',

  // 展示页
  'showcase.routes.title': '路线',
  'showcase.routes.note': '行程中的景点。完整介绍正在整理中。',
  'showcase.routes.text': '行程中的景点。介绍正在整理中。',
  'showcase.stay.title': '住宿',
  'showcase.stay.note': '各城市的住宿级别。具体酒店待确认。',
  'showcase.stay.text': '经济、标准与豪华级别的住宿。酒店名单待确认。',
  'showcase.food.title': '餐饮',
  'showcase.food.note': '沿途各城市的餐饮安排。菜单待确认。',
  'showcase.food.text': '按行程安排的餐饮。菜单与餐厅待确认。',
}
