<script setup lang="ts">
import { ref } from 'vue'
import {
  PRIMARY_ITEMS,
  SECONDARY_ITEMS,
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
  <div class="carousel">
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
            <span class="item-name">{{ itemLabel(key, l.id, ctx) }}</span>
            <span v-if="itemNote(key, l.id)" class="item-note muted">{{ itemNote(key, l.id) }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>

          <!-- Шесть услуг свёрнуты в одну строку, состояние общее для всех карточек -->
          <button class="item" :aria-expanded="trip.servicesOpen" @click.stop="trip.toggleServices()">
            <span class="tick" aria-hidden="true">✓</span>
            <span class="item-name">
              {{ t('row.group', { count: count(SECONDARY_ITEMS.length, 'u.service') }) }}
            </span>
            <span
              class="chev turn"
              :style="{ transform: trip.servicesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
              aria-hidden="true"
              >⌄</span
            >
          </button>

          <div class="services" :class="{ open: trip.servicesOpen }">
            <div class="services-inner">
              <button
                v-for="key in SECONDARY_ITEMS"
                :key="key"
                class="item service-item"
                @click.stop="emit('openItem', { level: l.id, key })"
              >
                <span class="tick" aria-hidden="true">✓</span>
                <span class="item-name">{{ itemLabel(key, l.id, ctx) }}</span>
                <span v-if="itemNote(key, l.id)" class="item-note muted">{{
                  itemNote(key, l.id)
                }}</span>
                <span class="chev" aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="dots" aria-hidden="true">
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
  padding: 12px;
  cursor: pointer;
}

/* На широком экране видны все три карточки сразу */
@media (min-width: 700px) {
  .tariff {
    flex: 1 1 0;
  }

  .dots {
    display: none;
  }
}

/* Выбранный тариф */
.tariff.on {
  border: 2px solid var(--brand-yellow);
  padding: 11px;
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

.item {
  width: 100%;
  min-height: 46px;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.item:last-child {
  border-bottom: none;
}

/* Галочка слева — одинаковая на всех тарифах */
.tick {
  color: #1a7f3c;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  min-width: 0;
}

.item-note {
  font-size: 12px;
  white-space: nowrap;
}

.chev {
  color: var(--text-muted);
  font-size: 18px;
}

/* Стрелка разворота: та же плавность, что у панели итога */
.chev.turn {
  transition: transform 0.15s;
  display: inline-block;
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

/* Вложенные строки с отступом слева */
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
