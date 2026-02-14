# Coffeehouse Reboot — Ember & Roast

Production-ready wow-website кофейни со скролл-сценарием:

1. Hero: визуал «кофе льётся в кружку» + микровзаимодействия
2. Блок с зёрнами и сортами
3. История кофейни (timeline)
4. Меню + CTA

## Tech

- Vanilla HTML/CSS/JS (GitHub Pages-friendly)
- Адаптивная вёрстка
- `prefers-reduced-motion` поддержка
- Параллакс, reveal-эффекты, интерактивные карточки, табы меню

## Assets

Использованы локальные фото-ассеты из `assets/`.
Если Google Vids/Veo недоступен в сессии — проект продолжает работу с качественным fallback.

## Deploy

Автодеплой через GitHub Actions (`.github/workflows/deploy-pages.yml`) при пуше в `master`.

Ожидаемый live URL:

`https://1notlov3.github.io/coffeehouse-reboot/`
