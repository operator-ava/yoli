import { computed } from 'vue'
import type { Access } from '@/data'

/** Проверка доступа к контенту.
 *  Оплата не реализована — заглушка всегда считает платное закрытым.
 *  Когда появится биллинг, сюда придёт реальная проверка покупок. */
export function useAccess() {
  // Список купленных категорий. Пока пусто.
  const purchased = computed<string[]>(() => [])

  function isUnlocked(access: Access, category?: string): boolean {
    if (access === 'free') return true
    return category ? purchased.value.includes(category) : false
  }

  return { purchased, isUnlocked }
}
