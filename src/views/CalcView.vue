<script setup lang="ts">
// Главный и единственный экран: витрина трёх пакетных туров.
//
// Порядок блоков задан заказчиком и держится жёстко:
//   заголовок → кто путешествует → перелёт → длительность → пакет → маршрут.
//
// Свободный конструктор (даты и тариф по каждому городу) ОТЛОЖЕН, а не удалён:
// его экран и компоненты лежат в src/legacy, состояние — в сторе. Вернём
// вторым режимом по решению заказчика.
import { computed, ref } from 'vue'
import { useTripStore } from '@/stores/trip'
import {
  cityNameGen,
  MAX_PEOPLE,
  MIN_PEOPLE,
  type InclusionContext,
  type InclusionKey,
  type Level,
} from '@/data'
import { packagePrice } from '@/composables/calc'
import { plural, t } from '@/composables/useI18n'
import TotalPanel from '@/components/TotalPanel.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import TourSetup from '@/components/TourSetup.vue'
import TariffCarousel from '@/components/TariffCarousel.vue'
import RouteCity from '@/components/RouteCity.vue'
import HotelSheet from '@/components/HotelSheet.vue'
import MealSheet from '@/components/MealSheet.vue'
import TransferSheet from '@/components/TransferSheet.vue'
import InsuranceSheet from '@/components/InsuranceSheet.vue'
import GuideSheet from '@/components/GuideSheet.vue'
import ServiceSheet from '@/components/ServiceSheet.vue'
import TaxiSheet from '@/components/TaxiSheet.vue'
import PaidScreen from '@/components/PaidScreen.vue'
import FlightRow from '@/components/FlightRow.vue'
import FlightScreen from '@/components/FlightScreen.vue'

const trip = useTripStore()

// Открытый лист подробностей пункта состава. Календарь даты вылета живёт
// на экране «Перелёт», а не здесь.
const itemSheet = ref<{ level: Level; key: InclusionKey } | null>(null)

// Экран благодарности после «Оплатить». Расчёт под ним остаётся нетронутым.
const paid = ref(false)

// Экран «Перелёт — скоро». Заглушка, в расчёт не входит.
const flight = ref(false)

/** Контекст состава для листов. Тур всегда начинается трансфером из аэропорта
 *  в Ташкент, а переезды между городами идут дальше по жёсткому маршруту. */
const ctx = computed<InclusionContext>(() => {
  const first = trip.tour[0]
  return {
    transfer: 'airport',
    previousCity: first ? cityNameGen(first.cityId) : undefined,
  }
})

/** Цена пакета на человека: за ВЕСЬ тур, уже со скидкой за размер группы. */
function price(level: Level): number {
  return packagePrice(level, trip.nights, trip.people)
}

/** Выбор тарифа прямо из открытого листа. */
function chooseFromSheet(level: Level) {
  trip.setTourLevel(level)
  itemSheet.value = null
}

/** Первый город тура — по нему листы показывают питание и размещение. */
const firstCity = computed(() => trip.tour[0]?.cityId ?? 'tashkent')

/** Диапазон дат первого города — его просит лист питания. */
const firstRange = computed(() => {
  const c = trip.tour[0]
  return c ? { from: c.from, to: c.to } : null
})
</script>

<template>
  <section class="app-content">
    <!-- Название экрана стоит в теле, а не в шапке: в шапке места хватало
         только на короткое слово, да и заказчику там оно не понравилось -->
    <h1>{{ t('nav.calc') }}</h1>

    <h2>{{ t('calc.who') }}</h2>
    <div class="card block">
      <div class="counter">
        <button
          class="round"
          :disabled="trip.people <= MIN_PEOPLE"
          :aria-label="t('calc.minusPerson')"
          @click="trip.changePeople(-1)"
        >
          −
        </button>
        <div class="count">
          <span class="count-num tnum">{{ trip.people }}</span>
          <span class="count-label">{{ plural(trip.people, 'u.person') }}</span>
        </div>
        <button
          class="round"
          :disabled="trip.people >= MAX_PEOPLE"
          :aria-label="t('calc.plusPerson')"
          @click="trip.changePeople(1)"
        >
          +
        </button>
      </div>
    </div>

    <!-- Рейсов нет, но дата вылета живёт здесь: человек сначала решает,
         когда летит, и только потом — сколько живёт. На цену не влияет. -->
    <h2>{{ t('calc.flight') }}</h2>
    <FlightRow :date="trip.startDate" @open="flight = true" />

    <!-- Только длительность: дата вылета выбирается блоком выше.
         Даты городов считаются от неё подряд — пересечений не бывает. -->
    <h2>{{ t('calc.duration') }}</h2>
    <TourSetup :nights="trip.nights" :start-date="trip.startDate" @pick="trip.setNights($event)" />

    <!-- Тариф выбирается ОДИН РАЗ на весь тур, цена — за весь тур на человека -->
    <h2>{{ t('calc.package') }}</h2>
    <TariffCarousel
      :price="price"
      :nights="trip.nights"
      :selected="trip.tourLevel"
      :ctx="ctx"
      @choose="trip.setTourLevel($event)"
      @open-item="itemSheet = { level: $event.level, key: $event.key }"
    />
    <p v-if="!trip.tourLevel" class="muted no-level">{{ t('calc.pickTariff') }}</p>

    <!-- Маршрут: четыре города в жёстком порядке, дни с точками.
         Цен здесь нет — пакет продаётся целиком. -->
    <h2>{{ t('calc.route') }}</h2>
    <div class="cities">
      <RouteCity
        v-for="c in trip.tour"
        :key="c.cityId"
        :plan="c"
        :open="trip.isRouteOpen(c.cityId)"
        @toggle="trip.toggleRoute(c.cityId)"
      />
    </div>
  </section>

  <!-- Итог виден всегда, на любом шаге ввода -->
  <TotalPanel @pay="paid = true" />

  <!-- Оплата не производится: макет экрана после заказа -->
  <PaidScreen v-if="paid" @close="paid = false" />

  <!-- Рейсов пока нет, но дата вылета выбирается здесь -->
  <FlightScreen
    v-if="flight"
    :date="trip.startDate"
    :nights="trip.nights"
    @pick="trip.setStartDate($event)"
    @close="flight = false"
  />

  <!-- У гостиницы и питания свои листы, остальное — общий -->
  <BottomSheet v-if="itemSheet" @close="itemSheet = null">
    <HotelSheet
      v-if="itemSheet.key === 'hotel'"
      :city-id="firstCity"
      :level="itemSheet.level"
      :selected-level="trip.tourLevel"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <TransferSheet
      v-else-if="itemSheet.key === 'transfer'"
      :level="itemSheet.level"
      :kind="ctx.transfer"
      :previous-city="ctx.previousCity"
      :selected-level="trip.tourLevel"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <GuideSheet
      v-else-if="itemSheet.key === 'guide'"
      :level="itemSheet.level"
      :selected-level="trip.tourLevel"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <MealSheet
      v-else-if="itemSheet.key === 'food' && firstRange"
      :city-id="firstCity"
      :level="itemSheet.level"
      :range="firstRange"
      :selected-level="trip.tourLevel"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
    <TaxiSheet v-else-if="itemSheet.key === 'taxi'" @close="itemSheet = null" />
    <InsuranceSheet v-else-if="itemSheet.key === 'insurance'" @close="itemSheet = null" />
    <ServiceSheet
      v-else
      :item-key="itemSheet.key"
      :level="itemSheet.level"
      :selected-level="trip.tourLevel"
      @choose="chooseFromSheet"
      @close="itemSheet = null"
    />
  </BottomSheet>
</template>

<style scoped>
/* Длинное название переносится на две строки — места в теле достаточно */
h1 {
  margin-top: 16px;
}

h2 {
  margin-top: 18px;
}

/* Одна высота со строкой «Перелёт» и строками городов — общий токен */
.block {
  min-height: var(--row-height);
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.counter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.round {
  width: var(--tap-min);
  height: var(--tap-min);
  border-radius: 50%;
  border: 1px solid var(--border);
  font-size: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.round:disabled {
  color: var(--border);
}

.count {
  text-align: center;
  line-height: 1.1;
}

.count-num {
  display: block;
  font-size: 26px;
  font-weight: 700;
}

.count-label {
  font-size: 12px;
  color: var(--text-muted);
}

/* Тариф не выбран — подсказка под каруселью, как было в карточке города */
.no-level {
  font-size: 13px;
  margin: 8px 0 2px;
  text-align: center;
}

.cities {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
