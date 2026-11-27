# English, Russian and Kazakh glossary

[The editable dictionary](prototype/strings.js) is the canonical list for this review. Each key has values in EN, RU and KK order. Use the [route mapping](UX_HANDOFF.md) to scope implementation. For FINAL-06, generate dictionary modules with identical keys and a nonblank English fallback for unsupported or missing text. Persist a validated preference and set the document language after switching. Keep source text in its original language with explicit provenance.

| Key | English | Russian | Kazakh |
| --- | --- | --- | --- |
| workspace | Study workspace | Учебное пространство | Оқу кеңістігі |
| courses | Courses | Курсы | Курстар |
| documents | Documents | Документы | Құжаттар |
| history | Chat history | История чатов | Чаттар тарихы |
| source | Source excerpt | Фрагмент источника | Дереккөз үзіндісі |
| deadlines | Deadlines | Сроки | Мерзімдер |
| candidates | Date candidates | Предложенные даты | Ұсынылған күндер |
| synthetic | Synthetic demo · Example replay | Демо на синтетических данных · Готовый ответ | Синтетикалық деректері бар демо · Дайын жауап |
| simulatedLive | Synthetic demo · Simulated live mode · Example replay | Демо на синтетических данных · Имитация живого режима · Готовый ответ | Синтетикалық деректері бар демо · Тікелей режим симуляциясы · Дайын жауап |
| held | Sign-in is currently unavailable | Вход пока недоступен | Кіру әзірге қолжетімсіз |
| unavailable | Data unavailable | Данные недоступны | Деректер қолжетімсіз |

Use Intl with the selected locale and Asia/Almaty for explicit calendar labels. The server owns date status and candidates. Keep long localized control labels wrapping while retaining touch target size. Native linguistic review is pending for Russian and Kazakh. The browser smoke test covers locale switching and horizontal overflow across the route inventory.
