<script setup lang="ts">
// Город маршрута: свёрнутая строка с датами, развёрнутый вид — дни с точками.
//
// Цен здесь нет и быть не должно: пакет продаётся целиком, отдельной цены
// у города не существует. Блок отвечает на вопрос «что я увижу», а не «сколько
// это стоит» — на второй отвечает панель итога.
import { computed } from 'vue'
import { city, cityName } from '@/data'
import { dayMonth, short } from '@/composables/dates'
import { count, t } from '@/composables/useI18n'
import type { ItineraryCity } from '@/composables/itinerary'

const props = defineProps<{
  plan: ItineraryCity
  open: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()

const info = computed(() => city(props.plan.cityId))
const name = computed(() => cityName(props.plan.cityId))

/** «25.08 – 27.08» — числовой формат, одинаковый во всех языках. */
const dates = computed(() => `${short(props.plan.from)} – ${short(props.plan.to)}`)
</script>

<template>
  <article class="card">
    <!-- Шапка — она же кнопка. Свёрнутый и развёрнутый вид отличаются только
         стрелкой: строка с датами нужна в обоих. -->
    <button class="head tap" :aria-expanded="open" @click="emit('toggle')">
      <img class="thumb" :src="info?.photo" :alt="name" loading="lazy" />
      <span class="col">
        <span class="name">{{ name }}</span>
        <span class="muted sub">{{ dates }} · {{ count(plan.nights, 'u.night') }}</span>
      </span>
      <!-- Сколько точек входит из скольких. Без этого числа человек решит,
           что часть достопримечательностей просто забыли. -->
      <span class="meta">
        <span class="muted count">{{ t('route.of', { n: plan.selected, total: plan.total }) }}</span>
        <span class="chev muted" :class="open ? 'chev-up' : 'chev-down'" aria-hidden="true">{{
          open ? '⌃' : '⌄'
        }}</span>
      </span>
    </button>

    <!-- Развёрнутый вид: дни с точками. Дни отделены друг от друга линией
         и воздухом, внутри дня строки идут списком без разлиновки. -->
    <div v-if="open" class="days">
      <!-- Развёрнутый вид повторяет то же число словами: отбор идёт
           по рейтингу, и это надо назвать прямо, а не оставлять догадкой. -->
      <p class="note muted">{{ t('route.note', { n: plan.selected, total: plan.total }) }}</p>

      <section v-for="d in plan.days" :key="d.date" class="day">
        <h4 class="day-head">
          <span class="day-num">{{ t('route.day', { n: d.index }) }}</span>
          <span class="day-date muted">{{ dayMonth(d.date) }}</span>
          <!-- Прилёт и вылет — половинные дни, и это надо назвать -->
          <span v-if="d.arrival" class="day-tag">{{ t('route.arrival') }}</span>
          <span v-else-if="d.departure" class="day-tag">{{ t('route.departure') }}</span>
        </h4>

        <!-- Точки города кончились раньше дней. Программа не растягивается
             искусственно: день честно называется свободным. -->
        <p v-if="!d.points.length" class="free muted">{{ t('route.free') }}</p>

        <ul v-else class="points">
          <li v-for="p in d.points" :key="p.id" class="point">
            <span class="point-name">{{ p.name }}</span>
            <span class="point-cat muted">{{ t(`poi.cat.${p.category}`) }}</span>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* Свёрнутая строка держит тот же токен высоты, что и остальные строки экрана */
.head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: var(--row-height);
  padding: 8px 12px 8px 8px;
  text-align: left;
}

.thumb {
  width: var(--row-thumb);
  height: var(--row-thumb);
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name {
  font-size: 16px;
  font-weight: 600;
}

.sub {
  font-size: 13px;
}

.head .chev {
  font-size: 15px;
}

/* Правая колонка свёрнутой строки: число точек над стрелкой.
   Прижата вправо, поэтому стрелка стоит на месте при любом числе. */
.meta {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 4px;
}

.count {
  font-size: 12px;
  white-space: nowrap;
}

/* Пояснение к отбору: один раз на город, над первым днём */
.note {
  font-size: 12px;
  line-height: 1.4;
  margin: 0 0 14px;
}

/* День без программы: не пустое место, а названное состояние */
.free {
  font-size: 14px;
  margin: 0;
}

.days {
  padding: 2px 12px 12px;
}

/* Воздух между днями — основной разделитель. Линия только сверху,
   чтобы день читался как отдельный кусок программы, а не строка таблицы. */
.day + .day {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.day-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 10px;
  text-transform: none;
  letter-spacing: 0;
}

.day-num {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.day-date {
  font-size: 14px;
}

/* День вылета: половина программы, и человек должен это видеть заранее */
.day-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  background: var(--brand-yellow-soft);
  border-radius: 999px;
  padding: 3px 8px;
}

.points {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Название слева, категория мелким приглушённым справа. Длинное название
   переносится и не наезжает на категорию: у категории запрет на сжатие. */
.point {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.point-name {
  font-size: 15px;
  line-height: 1.35;
  min-width: 0;
}

.point-cat {
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
