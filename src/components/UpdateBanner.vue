<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { t } from '@/composables/useI18n'

// Плашка обновления. Само ничего не перезагружается — только по нажатию.
// Стоит в потоке над нижним баром, поэтому ничего не перекрывает.
const { needRefresh, updateServiceWorker } = useRegisterSW()

const STORAGE_KEY = 'yoli.updateDismissed'

/** Отложено именно для этой сборки: после обновления метка перестанет совпадать
 *  и плашка снова появится, когда выйдет следующая версия. */
const dismissed = ref(read() === __APP_BUILD__)

function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

// Появился новый ожидающий воркер — снимаем прежний отказ.
watch(needRefresh, (value) => {
  if (value && read() !== __APP_BUILD__) dismissed.value = false
})

const visible = computed(() => needRefresh.value && !dismissed.value)

function later() {
  dismissed.value = true
  try {
    localStorage.setItem(STORAGE_KEY, __APP_BUILD__)
  } catch {
    // Не смогли запомнить — плашка просто скроется до перезагрузки
  }
}

function update() {
  // skipWaiting и перезагрузка страницы делает сам плагин
  updateServiceWorker(true)
}
</script>

<template>
  <div v-if="visible" class="banner">
    <span class="text">{{ t('update.title') }}</span>
    <button class="action" @click="update">{{ t('update.button') }}</button>
    <button class="close" :aria-label="t('update.later')" @click="later">✕</button>
  </div>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--brand-graphite);
  color: #fff;
  padding: 8px calc(12px + var(--safe-right)) 8px calc(12px + var(--safe-left));
  flex-shrink: 0;
}

.text {
  flex: 1;
  font-size: 13px;
  min-width: 0;
}

.action {
  min-height: 44px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  background: var(--brand-yellow);
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.close {
  width: 44px;
  min-height: 44px;
  color: #fff;
  opacity: 0.7;
  font-size: 16px;
  flex-shrink: 0;
}
</style>
