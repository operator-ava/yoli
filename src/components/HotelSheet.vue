<script setup lang="ts">
import { computed } from 'vue'
import {
  amenitiesFor,
  cityName,
  hotelById,
  hotelsFor,
  LEVEL_STARS,
  LEVELS,
  levelName,
  type CityId,
  type Level,
} from '@/data'
import { t } from '@/composables/useI18n'
import HotelPhoto from '@/components/HotelPhoto.vue'

// Лист «Гостиница». Выбор отеля не влияет на цену.
const props = defineProps<{
  cityId: CityId
  level: Level
  hotelId?: string
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; pickHotel: [string]; close: [] }>()

const list = computed(() => hotelsFor(props.cityId, props.level))
const current = computed(() => hotelById(props.cityId, props.level, props.hotelId) ?? list.value[0])
const others = computed(() => list.value.filter((h) => h.id !== current.value?.id))
const stars = computed(() => current.value?.stars ?? LEVEL_STARS[props.level])
const amenities = computed(() => amenitiesFor(props.level))

const otherLevels = computed(() =>
  LEVELS.filter((l) => l.id !== props.level).map((l) => ({
    name: levelName(l.id),
    category: t(`hotel.cat.${l.id}`),
  })),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">{{ t('hotel.title', { city: cityName(cityId) }) }}</h2>
        <p class="sub muted">{{ t('sheet.tariff', { name: levelName(level) }) }}</p>
      </div>
      <button class="close" :aria-label="t('sheet.close')" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <!-- Реальных фото отелей нет — фирменная заглушка -->
      <HotelPhoto :stars="stars" />

      <!-- Имени нет — показываем категорию уровня -->
      <div class="name">{{ current?.name || t(`hotel.cat.${level}`) }}</div>
      <div class="meta muted">
        <span v-if="current">{{ current.stars }}★ · {{ t(current.areaKey) }} · </span>
        {{ cityName(cityId) }}
      </div>

      <p v-if="current" class="service">{{ t(current.serviceKey) }}</p>

      <template v-if="amenities.length">
        <h3>{{ t('hotel.amenities') }}</h3>
        <div class="amenities">
          <div v-for="a in amenities" :key="a" class="amenity">{{ t(`am.${a}`) }}</div>
        </div>
      </template>

      <!-- Другие отели этого уровня. Один отель или ни одного — блока нет. -->
      <template v-if="others.length">
        <h3>{{ t('hotel.others') }}</h3>
        <button
          v-for="h in others"
          :key="h.id"
          class="hotel-row"
          @click="emit('pickHotel', h.id)"
        >
          <span class="hotel-name">{{ h.name }}</span>
          <span class="hotel-meta muted">{{ h.stars }}★ · {{ t(h.areaKey) }}</span>
        </button>
      </template>

      <h3>{{ t('sheet.others') }}</h3>
      <div v-for="o in otherLevels" :key="o.name" class="other">
        <div class="other-name">{{ o.name }}</div>
        <p class="muted other-text">{{ o.category }}</p>
      </div>
    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">{{ t('sheet.choose') }}</button>
    </footer>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: none;
  letter-spacing: 0;
  color: var(--text);
}

.sub {
  font-size: 13px;
  margin: 2px 0 0;
}

.close {
  width: 40px;
  height: 40px;
  min-height: 40px;
  font-size: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.scroll {
  overflow-y: auto;
  overscroll-behavior: contain;
  flex: 1;
  min-height: 0;
}

.name {
  font-size: 17px;
  font-weight: 600;
  margin-top: 12px;
}

.meta {
  font-size: 13px;
}

.service {
  font-size: 14px;
  margin: 10px 0 0;
}

h3 {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin: 20px 0 8px;
}

.amenities {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px 12px;
}

.amenity {
  font-size: 14px;
  padding: 5px 0;
}

.hotel-row {
  width: 100%;
  min-height: var(--tap-min);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 2px;
  border-top: 1px solid var(--border);
  text-align: left;
}

.hotel-name {
  font-size: 15px;
  font-weight: 600;
}

.hotel-meta {
  font-size: 13px;
}

.other {
  border-top: 1px solid var(--border);
  padding: 10px 0;
}

.other-name {
  font-size: 14px;
  font-weight: 600;
}

.other-text {
  font-size: 14px;
  margin: 2px 0 0;
}

.foot {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.btn {
  width: 100%;
  min-height: var(--tap-min);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-size: 15px;
  font-weight: 600;
}

.btn.primary {
  background: var(--brand-yellow);
  border-color: var(--brand-yellow);
}
</style>
