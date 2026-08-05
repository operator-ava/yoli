<script setup lang="ts">
import { ref } from 'vue'
import { filledItems, inclusion, LEVELS, type CityId, type InclusionKey, type Level } from '@/data'
import { tariffCardPrice } from '@/composables/calc'
import { money } from '@/composables/format'
import { plural } from '@/composables/dates'
import BonusBlock from '@/components/BonusBlock.vue'

const props = defineProps<{
  cityId: CityId
  nights: number
  selected: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; openItem: [{ level: Level; key: InclusionKey }] }>()

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
  return tariffCardPrice(props.cityId, level, props.nights)
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
          <div class="name">{{ l.name }}</div>
          <span v-if="selected === l.id" class="check" aria-label="Выбран">✓</span>
        </header>

        <div class="price tnum">{{ money(price(l.id)) }}</div>
        <div class="per muted">
          за {{ nights }} {{ plural(nights, 'день', 'дня', 'дней') }} / чел
        </div>

        <!-- Состав тарифа: пустые пункты не выводятся -->
        <div class="items">
          <button
            v-for="item in filledItems(cityId, l.id)"
            :key="item.key"
            class="item"
            @click.stop="emit('openItem', { level: l.id, key: item.key })"
          >
            <span class="item-name">{{ item.label }}</span>
            <span class="item-sum muted">{{ inclusion(cityId, l.id, item.key).summary }}</span>
            <span class="chev" aria-hidden="true">›</span>
          </button>
        </div>

        <BonusBlock :level="l.id" />
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

.items {
  margin-top: 10px;
  border-top: 1px solid var(--border);
}

.item {
  width: 100%;
  min-height: var(--tap-min);
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

.item:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
}

.item-sum {
  font-size: 12px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chev {
  color: var(--text-muted);
  font-size: 18px;
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
