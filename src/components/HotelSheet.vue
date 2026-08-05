<script setup lang="ts">
import { computed } from 'vue'
import { AMENITIES, cityName, hotel, LEVELS, type CityId, type Level } from '@/data'

// Лист «Гостиница» в стиле карточки отеля.
// Названий отелей нет — вместо имени показывается категория.
const props = defineProps<{
  cityId: CityId
  level: Level
  selectedLevel: Level | null
}>()

const emit = defineEmits<{ choose: [Level]; close: [] }>()

const data = computed(() => hotel(props.cityId, props.level))
const levelName = computed(() => LEVELS.find((l) => l.id === props.level)?.name ?? '')

const amenities = computed(() =>
  AMENITIES.filter((a) => data.value.amenities.includes(a.key)),
)

const others = computed(() =>
  LEVELS.filter((l) => l.id !== props.level).map((l) => ({
    name: l.name,
    category: hotel(props.cityId, l.id).category,
  })),
)
</script>

<template>
  <div class="body">
    <header class="head">
      <div>
        <h2 class="title">Гостиница · {{ cityName(cityId) }}</h2>
        <p class="sub muted">Тариф «{{ levelName }}»</p>
      </div>
      <button class="close" aria-label="Закрыть" @click="emit('close')">✕</button>
    </header>

    <div class="scroll">
      <!-- Фото размещения. Пока фотографий отелей нет — место остаётся пустым. -->
      <img v-if="data.photo" class="photo" :src="data.photo" :alt="data.category" />

      <!-- Имени отеля нет, показываем категорию -->
      <div class="category">{{ data.name || data.category }}</div>
      <div class="city muted">{{ cityName(cityId) }}</div>

      <p v-if="data.service" class="service">{{ data.service }}</p>

      <!-- Блок удобств рисуется только если удобства заданы в данных -->
      <template v-if="amenities.length">
        <h3>Удобства</h3>
        <div class="amenities">
          <div v-for="a in amenities" :key="a.key" class="amenity">{{ a.label }}</div>
        </div>
      </template>

      <div class="swap">
        <span>Можно поменять на другой отель этого уровня</span>
        <span class="muted later">Выбор появится позже</span>
      </div>

      <h3>В других тарифах</h3>
      <div v-for="o in others" :key="o.name" class="other">
        <div class="other-name">{{ o.name }}</div>
        <p class="muted other-text">{{ o.category }}</p>
      </div>
    </div>

    <footer v-if="selectedLevel !== level" class="foot">
      <button class="btn primary" @click="emit('choose', level)">Выбрать этот тариф</button>
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

.photo {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: var(--radius-sm);
  margin-bottom: 12px;
}

.category {
  font-size: 17px;
  font-weight: 600;
}

.city {
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
  gap: 4px 12px;
}

.amenity {
  font-size: 14px;
  padding: 4px 0;
}

.swap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: var(--tap-min);
  margin-top: 16px;
  padding: 0 12px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  /* Выбор отеля — следующий этап, строка неактивна */
  color: var(--text-muted);
}

.later {
  font-size: 12px;
  white-space: nowrap;
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
