// Названия точек на английском и китайском.
//
// ВЕДЁТСЯ РУКАМИ, в отличие от poi.ts — тот генерируется из файла заказчика
// и переводов не содержит. Разделение намеренное: пришёл новый xlsx —
// poi.ts перегенерировался, а переводы остались на месте.
//
// Английский: общепринятые международные написания, а не транслитерация
// с русского. Регистан — Registan, Гур-Эмир — Gur-e-Amir, Шахи-Зинда —
// Shah-i-Zinda, Ичан-Кала — Itchan Kala, Пои-Калян — Po-i-Kalyan,
// Ляби-Хауз — Lyab-i-Hauz.
//
// Китайский: написания, принятые в китайских туристических источниках,
// а не фонетическая калька с русского. Регистан — 雷吉斯坦广场.
//
// ⚠️ ТРЕБУЕТ ПРОВЕРКИ ЗАКАЗЧИКОМ: точки с пометкой `check: true` не имеют
// устоявшегося написания хотя бы на одном языке — они переведены по смыслу.
// Список печатает `node scripts/check-poi-names.mjs`.
export interface PoiName {
  en: string
  zh: string
  /** Устоявшегося написания нет, перевод сделан по смыслу. */
  check?: boolean
}

export const POI_NAMES: Record<string, PoiName> = {
  // ── Ташкент ───────────────────────────────────────────────────────────
  'tashkent-1': { en: 'Chorsu Bazaar', zh: '乔尔苏巴扎' },
  'tashkent-2': { en: 'Amir Timur Square', zh: '阿米尔·帖木儿广场' },
  'tashkent-3': { en: 'Independence Square', zh: '独立广场' },
  'tashkent-4': { en: 'Hazrati Imam Complex', zh: '哈兹拉提伊玛目建筑群' },
  'tashkent-5': { en: 'Minor Mosque', zh: '白色清真寺（米诺尔）' },
  'tashkent-6': { en: 'Tashkent TV Tower', zh: '塔什干电视塔' },
  'tashkent-7': { en: 'State Museum of History of Uzbekistan', zh: '乌兹别克斯坦国家历史博物馆' },
  'tashkent-8': { en: 'Kukeldash Madrasah', zh: '库克尔达什经学院' },
  'tashkent-9': { en: 'Center of Islamic Civilization', zh: '伊斯兰文明中心' },
  'tashkent-10': { en: 'Alisher Navoi Opera and Ballet Theatre', zh: '阿利舍尔·纳沃伊歌剧芭蕾舞剧院' },
  'tashkent-11': { en: 'Museum of Applied Arts', zh: '实用艺术博物馆' },
  'tashkent-12': { en: 'Kosmonavtlar Metro Station', zh: '宇航员地铁站', check: true },
  'tashkent-13': { en: 'Central Asian Plov Centre', zh: '中亚手抓饭中心', check: true },
  'tashkent-14': { en: 'Barak-Khan Madrasah', zh: '巴拉克汗经学院' },
  'tashkent-15': { en: 'Magic City Park', zh: '魔幻城公园', check: true },
  'tashkent-16': { en: 'Japanese Garden', zh: '日本花园' },
  'tashkent-17': { en: 'Romanov Palace', zh: '罗曼诺夫宫' },
  'tashkent-18': { en: 'Alay Bazaar', zh: '阿莱巴扎' },
  'tashkent-19': { en: 'State Museum of Arts of Uzbekistan', zh: '乌兹别克斯坦国家艺术博物馆' },

  // ── Самарканд ─────────────────────────────────────────────────────────
  'samarkand-1': { en: 'Registan', zh: '雷吉斯坦广场' },
  'samarkand-2': { en: 'Shah-i-Zinda', zh: '沙赫静达陵墓群' },
  'samarkand-3': { en: 'Gur-e-Amir', zh: '古尔·埃米尔陵墓' },
  'samarkand-4': { en: 'Bibi-Khanym Mosque', zh: '比比哈努姆清真寺' },
  'samarkand-5': { en: 'Ulugh Beg Observatory', zh: '兀鲁伯天文台' },
  'samarkand-6': { en: 'Siab Bazaar', zh: '夏伊巴扎' },
  'samarkand-7': { en: 'Afrasiyab Museum', zh: '阿夫拉西阿卜博物馆' },
  'samarkand-8': { en: 'Tomb of Saint Daniel', zh: '圣丹尼尔陵墓', check: true },
  'samarkand-9': { en: 'Imam al-Bukhari Mausoleum', zh: '伊玛目布哈里陵墓' },
  'samarkand-10': { en: 'Meros Paper Mill, Konigil', zh: '梅罗斯手工造纸作坊', check: true },
  'samarkand-11': { en: 'Hazrat Khizr Mosque', zh: '哈兹拉特·赫兹尔清真寺' },
  'samarkand-12': { en: 'Rukhabad Mausoleum', zh: '鲁哈巴德陵墓' },
  'samarkand-13': { en: 'Khoja Ahrar Vali Complex', zh: '霍加·阿赫拉尔建筑群' },
  'samarkand-14': { en: 'Alisher Navoi Park', zh: '阿利舍尔·纳沃伊公园' },
  'samarkand-15': { en: 'Eternal City, Boqiy Shahar', zh: '永恒之城', check: true },
  'samarkand-16': { en: 'Hujum Silk Carpet Factory', zh: '胡朱姆丝毯工坊', check: true },
  'samarkand-17': { en: 'Khoja Abdi Darun Mausoleum', zh: '霍加·阿卜迪·达伦陵墓' },

  // ── Бухара ────────────────────────────────────────────────────────────
  'bukhara-1': { en: 'Po-i-Kalyan', zh: '波伊卡扬建筑群' },
  'bukhara-2': { en: 'Kalyan Minaret', zh: '卡扬宣礼塔' },
  'bukhara-3': { en: 'Kalyan Mosque', zh: '卡扬清真寺' },
  'bukhara-4': { en: 'Mir-i-Arab Madrasah', zh: '米里阿拉伯经学院' },
  'bukhara-5': { en: 'Ark Fortress', zh: '雅克城堡' },
  'bukhara-6': { en: 'Lyab-i-Hauz', zh: '拉比哈乌兹' },
  'bukhara-7': { en: 'Chor Minor', zh: '四塔经学院' },
  'bukhara-8': { en: 'Samanid Mausoleum', zh: '萨曼王朝陵墓' },
  'bukhara-9': { en: 'Bolo Hauz Mosque', zh: '博洛哈乌兹清真寺' },
  'bukhara-10': { en: 'Sitorai Mokhi-Khosa Palace', zh: '星月宫' },
  'bukhara-11': { en: 'Chashma-Ayub Mausoleum', zh: '恰什马阿尤布陵墓' },
  'bukhara-12': { en: 'Magoki-Attari Mosque', zh: '马戈基阿塔里清真寺' },
  'bukhara-13': { en: 'Toqi Zargaron, the jewellers dome', zh: '珠宝商圆顶市集', check: true },
  'bukhara-14': { en: 'Toqi Telpak Furushon, the hatters dome', zh: '帽商圆顶市集', check: true },
  'bukhara-15': { en: 'Toqi Sarrafon, the money changers dome', zh: '钱庄圆顶市集', check: true },
  'bukhara-16': { en: 'Nodir Divan-Begi Madrasah', zh: '纳迪尔·迪万别吉经学院' },
  'bukhara-17': { en: 'Bahauddin Naqshband Complex', zh: '巴哈丁·纳克什班迪建筑群' },
  'bukhara-18': { en: 'Chor-Bakr Necropolis', zh: '乔尔巴克尔陵园' },
  'bukhara-19': { en: 'Kukeldash Madrasah, Bukhara', zh: '库克尔达什经学院（布哈拉）' },
  'bukhara-20': { en: 'Tim Abdullakhan', zh: '阿卜杜拉汗商栈', check: true },
  'bukhara-21': { en: 'Saifiddin Bokharzi Mausoleum', zh: '赛义夫丁·巴哈尔济陵墓' },
  'bukhara-22': { en: 'Samanid Park', zh: '萨曼王朝公园', check: true },

  // ── Хива ──────────────────────────────────────────────────────────────
  'khiva-1': { en: 'Itchan Kala', zh: '伊禅卡拉' },
  'khiva-2': { en: 'Kalta Minor Minaret', zh: '卡尔塔米诺尔宣礼塔' },
  'khiva-3': { en: 'Kunya-Ark Citadel', zh: '库尼亚阿尔克城堡' },
  'khiva-4': { en: 'Tash Khauli Palace', zh: '塔什豪利宫' },
  'khiva-5': { en: 'Juma Mosque', zh: '聚礼清真寺' },
  'khiva-6': { en: 'Islam Khoja Minaret', zh: '伊斯兰霍加宣礼塔' },
  'khiva-7': { en: 'Muhammad Amin Khan Madrasah', zh: '穆罕默德·阿明汗经学院' },
  'khiva-8': { en: 'Ata Darvaza, the West Gate', zh: '阿塔达尔瓦扎西门' },
  'khiva-9': { en: 'Pahlavan Mahmud Mausoleum', zh: '帕赫拉万·马哈茂德陵墓' },
  'khiva-10': { en: 'Allakuli Khan Madrasah', zh: '阿拉库里汗经学院' },
  'khiva-11': { en: 'Sayid Alauddin Mausoleum', zh: '赛义德·阿拉乌丁陵墓' },
}

/** Точки без устоявшегося написания — их проверяет заказчик. */
export function poiNamesToCheck(): string[] {
  return Object.keys(POI_NAMES).filter((id) => POI_NAMES[id].check)
}
