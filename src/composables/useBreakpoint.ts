// Единственное место, где живёт граница «широкий экран».
// Компоненты спрашивают режим, а не сравнивают ширину сами.
import { onMounted, onUnmounted, ref } from 'vue'

/** С этой ширины три карточки тарифов помещаются рядом. */
export const WIDE_MIN_PX = 700

/** Реактивный признак широкого экрана. */
export function useIsWide() {
  const isWide = ref(false)
  let mql: MediaQueryList | null = null

  const update = () => {
    isWide.value = mql?.matches ?? false
  }

  onMounted(() => {
    mql = window.matchMedia(`(min-width: ${WIDE_MIN_PX}px)`)
    update()
    mql.addEventListener('change', update)
    // Подстраховка: поворот планшета не везде поднимает change у media query
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', update)
    window.removeEventListener('resize', update)
  })

  return isWide
}
