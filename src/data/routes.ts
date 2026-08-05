// Примеры-заглушки. Реальный контент придёт отдельными файлами в эту же папку.
import type { Route } from './types'

const routeOldTown: Route = {
  id: 'old-town',
  title: 'Старый город за два часа',
  summary: 'Короткая петля по historic-центру: площадь, набережная, смотровая.',
  region: 'Тбилиси',
  distance: 4200,
  duration: 120,
  difficulty: 'easy',
  access: 'free',
  pois: [
    {
      id: 'old-town-1',
      routeId: 'old-town',
      order: 1,
      title: 'Площадь Свободы',
      subtitle: 'Точка старта',
      coords: { lat: 41.6934, lng: 44.8015 },
      arrivalRadius: 40,
      access: 'free',
      blocks: [
        {
          id: 'old-town-1-intro',
          kind: 'text',
          title: 'С чего начинаем',
          body: 'Встаём спиной к колонне, дальше идём вниз по правой стороне.',
          access: 'free',
        },
        {
          id: 'old-town-1-food',
          kind: 'tip',
          title: 'Где поесть рядом',
          body: 'Подборка проверенных мест в двух минутах ходьбы.',
          access: 'paid',
          category: 'food',
        },
      ],
    },
    {
      id: 'old-town-2',
      routeId: 'old-town',
      order: 2,
      title: 'Серные бани',
      coords: { lat: 41.6885, lng: 44.8093 },
      arrivalRadius: 50,
      access: 'free',
      blocks: [
        {
          id: 'old-town-2-audio',
          kind: 'audio',
          title: 'Аудиорассказ, 3 мин',
          body: '/audio/old-town-2.mp3',
          access: 'free',
        },
      ],
    },
  ],
  segments: [
    {
      id: 'old-town-s1',
      routeId: 'old-town',
      fromPoiId: 'old-town-1',
      toPoiId: 'old-town-2',
      distance: 900,
      duration: 15,
      mode: 'walk',
      blocks: [
        {
          id: 'old-town-s1-hint',
          kind: 'text',
          title: 'В дороге',
          body: 'После арки держитесь левее — там начинается спуск к баням.',
          access: 'free',
        },
      ],
    },
  ],
}

const routeMountains: Route = {
  id: 'kazbegi-day',
  title: 'Казбеги: один день',
  summary: 'Выезд из города, перевал, монастырь Гергети и обратно.',
  region: 'Казбеги',
  distance: 312000,
  duration: 660,
  difficulty: 'medium',
  access: 'paid',
  pois: [
    {
      id: 'kazbegi-1',
      routeId: 'kazbegi-day',
      order: 1,
      title: 'Арка дружбы народов',
      coords: { lat: 42.4869, lng: 44.4525 },
      arrivalRadius: 120,
      access: 'free',
      blocks: [
        {
          id: 'kazbegi-1-text',
          kind: 'text',
          title: 'Что здесь',
          body: 'Смотровая на Девдоракское ущелье. Ветрено, берите куртку.',
          access: 'free',
        },
      ],
    },
    {
      id: 'kazbegi-2',
      routeId: 'kazbegi-day',
      order: 2,
      title: 'Троицкая церковь в Гергети',
      coords: { lat: 42.6624, lng: 44.6205 },
      arrivalRadius: 150,
      access: 'paid',
      blocks: [
        {
          id: 'kazbegi-2-logistics',
          kind: 'tip',
          title: 'Как подняться',
          body: 'Варианты подъёма, цены на трансфер и время в пути.',
          access: 'paid',
          category: 'logistics',
        },
        {
          id: 'kazbegi-2-hotels',
          kind: 'tip',
          title: 'Где заночевать',
          body: 'Гостиницы в Степанцминде с проверенным заездом.',
          access: 'paid',
          category: 'hotels',
        },
      ],
    },
  ],
  segments: [
    {
      id: 'kazbegi-s1',
      routeId: 'kazbegi-day',
      fromPoiId: 'kazbegi-1',
      toPoiId: 'kazbegi-2',
      distance: 32000,
      duration: 55,
      mode: 'car',
      blocks: [
        {
          id: 'kazbegi-s1-hint',
          kind: 'text',
          title: 'В дороге',
          body: 'Дорога серпантином, на подъёме бывает туман — сбрасывайте скорость.',
          access: 'free',
        },
      ],
    },
  ],
}

export const routes: Route[] = [routeOldTown, routeMountains]
