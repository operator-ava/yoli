<script setup lang="ts">
import { ref } from 'vue'
import {
  PRIMARY_ITEMS,
  secondaryItems,
  itemLabel,
  itemNote,
  LEVELS,
  levelName,
  type CityId,
  type InclusionContext,
  type InclusionKey,
  type Level,
} from '@/data'
import { cityPrice } from '@/composables/calc'
import { money } from '@/composables/format'
import { count, t } from '@/composables/useI18n'
import { useTripStore } from '@/stores/trip'
import { useIsWide } from '@/composables/useBreakpoint'

const props = defineProps<{
  cityId: CityId
  nights: number
  selected: Level | null
  ctx: InclusionContext
}>()

const emit = defineEmits<{
  choose: [Level]
  openItem: [{ level: Level; key: InclusionKey }]
}>()

// Разворот блока «Сопровождение» общий для всех карточек и городов.
const trip = useTripStore()

// Широкий экран: все три карточки видны, карусели нет.
const isWide = useIsWide()

/** Звёздочку рисуем отдельным элементом, чтобы привести её к размеру строки. */
function labelChunks(label: string) {
  const i = label.indexOf('★')
  if (i < 0) return [{ text: label, star: false }]
  return [
    { text: label.slice(0, i), star: false },
    { text: '★', star: true },
    { text: label.slice(i + 1), star: false },
  ].filter((c) => c.text !== '')
}

// Точки-индикаторы: какая карточка сейчас по центру при свайпе.
const track = ref<HTMLElement | null>(null)
const active = ref(0)

function onScroll() {
  const el = track.value
  if (!el) return
  const card = el.firstElementChild as HTMLElement | null
  if (!card) return
  active.value = Math.round(el.scrollLeft / (card.offsetWidth + 10))
}

function price(level: Level) {
  return cityPrice(level, props.nights, props.ctx.transfer)
}
</script>

<template>
  <div class="carousel" :class="{ wide: isWide }">
    <div ref="track" class="track" @scroll.passive="onScroll">
      <article
        v-for="l in LEVELS"
        :key="l.id"
        class="tariff"
        :class="{ on: selected === l.id }"
        @click="emit('choose', l.id)"
      >
        <header class="top">
          <div class="name">{{ levelName(l.id) }}</div>
          <span v-if="selected === l.id" class="check" :aria-label="t('tariff.selected')">✓</span>
        </header>

        <div class="price tnum">{{ money(price(l.id)) }}</div>
        <div class="per muted">{{ t('tariff.per', { nights: count(nights, 'u.night') }) }}</div>

        <!-- Чек-лист: галочка у каждой строки, разница видна в подписи справа -->
        <div class="included">{{ t('row.included') }}</div>
        <div class="items">
          <button
            v-for="key in PRIMARY_ITEMS"
            :key="key"
            class="item"
            @click.stop="emit('openItem', { level: l.id, key })"
          >
            <span class="tick" aria-hidden="true">✓</span>
            <span class="item-name">
              <template v-for="(c, i) in labelChunks(itemLabel(key, l.id, ctx))" :key="i">
                <span v-if="c.star" class="star">{{ c.text }}</span>
                <template v-else>{{ c.text }}</template>
              </template>
            </span>
            <span v-if="itemNote(key, l.id)" class="item-note muted">{{ itemNote(key, l.id) }}</span>
            <span class="chev chev-next" aria-hidden="true">›</span>
          </button>

        </div>

        <!-- Отдельный блок-кнопка: не пункт списка, поэтому видно, что раскрывается -->
        <button class="group-btn" :aria-expanded="trip.servicesOpen" @click.stop="trip.toggleServices()">
          <!-- Число цифрой и по факту: у люкса услуг на одну больше -->
          <span class="group-title">{{ t('row.group', { n: secondaryItems(l.id).length }) }}</span>
          <!-- Список раскрывается ВНИЗ, поэтому вниз раскрыть, вверх свернуть.
               Глифы разные, поворота одного нет. -->
          <span class="group-hint"
            >{{ trip.servicesOpen ? t('total.collapse') : t('total.more')
            }}<span
              class="chev group-chev"
              :class="trip.servicesOpen ? 'chev-up' : 'chev-down'"
              aria-hidden="true"
              >{{ trip.servicesOpen ? '⌃' : '⌄' }}</span
            ></span
          >
        </button>

        <div class="items">
          <div class="services" :class="{ open: trip.servicesOpen }">
            <div class="services-inner">
              <button
                v-for="key in secondaryItems(l.id)"
                :key="key"
                class="item service-item"
                @click.stop="emit('openItem', { level: l.id, key })"
              >
                <span class="tick" aria-hidden="true">✓</span>
                <span class="item-name">{{ itemLabel(key, l.id, ctx) }}</span>
                <span v-if="itemNote(key, l.id)" class="item-note muted">{{
                  itemNote(key, l.id)
                }}</span>
                <span class="chev chev-next" aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
        <!-- На широком экране у каждой карточки своя кнопка выбора -->
        <button v-if="isWide" class="pick" :class="{ chosen: selected === l.id }">
          {{ selected === l.id ? t('tariff.selected') : t('calc.pickTariff') }}
        </button>
      </article>
    </div>

    <!-- Точки обещают скрытый контент — на широком экране их нет -->
    <div v-if="!isWide" class="dots" aria-hidden="true">
      <span v-for="(l, i) in LEVELS" :key="l.id" class="dot" :class="{ on: i === active }" />
    </div>
  </div>
</template>

<style scoped>
.track {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  padding-bottom: 4px;
}

.track::-webkit-scrollbar {
  display: none;
}

.tariff {
  flex: 0 0 86%;
  scroll-snap-align: start;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px;
  cursor: pointer;
}

/* Широкий экран: карточки делят ширину поровну, карусели нет */
.carousel.wide .track {
  overflow-x: visible;
}

.carousel.wide .tariff {
  flex: 1 1 0;
  /* Длинный заголовок блока не должен растягивать колонку */
  min-width: 0;
}

/* Кнопка выбора внутри карточки */
.pick {
  width: 100%;
  min-height: 44px;
  margin-top: 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 14px;
  font-weight: 600;
  background: var(--card);
}

.pick.chosen {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
}

/* Выбранный тариф */
.tariff.on {
  border: 2px solid var(--brand-yellow);
  padding: 9px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.name {
  font-size: 15px;
  font-weight: 600;
}

.check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-yellow);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.price {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-top: 6px;
}

.per {
  font-size: 12px;
}

/* Заголовок чек-листа */
.included {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-top: 12px;
}

.items {
  margin-top: 4px;
  border-top: 1px solid var(--border);
}

/* Галочка и шеврон выравниваются по первой строке текста,
   поэтому левый край списка читается ровной колонкой. */
/* Название никогда не уже своего самого длинного слова — `min-content`.
   Не хватило места — переносится подпись справа, она короткая и на двух
   строках читается. Раньше колонка названия могла схлопнуться до нуля,
   и текст вылезал поверх подписи. */
.item {
  width: 100%;
  min-height: 46px;
  display: grid;
  grid-template-columns: auto minmax(min-content, 1fr) minmax(0, auto) auto;
  align-items: baseline;
  gap: 6px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.item:last-child {
  border-bottom: none;
}

/* Блок «Сопровождение»: без рамки и фона, две строки по центру.
   Отступ сверху отделяет его от четырёх строк списка. */
.group-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  min-height: 56px;
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  color: var(--brand-graphite);
  text-align: center;
  transition: background 0.12s;
}

.group-btn:active {
  background: var(--brand-yellow-soft);
}

/* Своя рамка вместо системной синей */
.group-btn:focus-visible {
  outline: 2px solid var(--brand-graphite);
  outline-offset: 2px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Подпись со стрелкой — обычная строка текста, не флекс-контейнер:
   стрелка садится на базовую линию подписи. */
.group-hint {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-strong);
}

.group-chev {
  margin-left: 5px;
}

/* Галочка слева — одинаковая на всех тарифах */
.tick {
  color: #1a7f3c;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Звёздочка в «Гостиница 2–3★»: размер строки, по базовой линии */
.star {
  font-size: 0.9em;
  line-height: 1;
  vertical-align: baseline;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
}

/* Кегль подписи не уменьшается — при нехватке места она переносится */
.item-note {
  font-size: 12px;
  text-align: right;
}

/* Шеврон строки чек-листа: кегль строки, выравнивание — в общем классе .chev */
.item .chev {
  color: var(--text-muted);
  font-size: 14px;
  width: 8px;
  text-align: right;
}

/* Плавный разворот вложенного списка */
.services {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}

.services.open {
  grid-template-rows: 1fr;
}

.services-inner {
  overflow: hidden;
  min-height: 0;
}

/* Список услуг под блоком, на белом фоне, с отступом */
.service-item {
  padding-left: 14px;
}

.service-item:last-child {
  border-bottom: none;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding-top: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
}

.dot.on {
  background: var(--text-muted);
}
</style>
