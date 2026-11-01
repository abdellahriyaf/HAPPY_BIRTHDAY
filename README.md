# Birthday page

Order: music picker (gramophone), cabinet, game (not built yet: `sections/game.js` is missing, so the last step shows "Coming soon").

The cabinet is cut straight from the original drawing (`cabinet.webp`, `rooms/*.webp`, `lockfront.webp`).
Clickable areas are traced on that drawing in `js/cabinet-map.js`.

Order inside the cabinet: 8 rooms and 19 photos, then the envelope (letter, key), the cloudy drawer (poem),
the castle (our story), then the locked drawer (opens with the key) and the game.
Each of those four is hidden under fog until its turn.

- `js/photos.js`  rooms and photos (the total is the points; the plan is 19) and each photo's comment
- `js/content.js` the letter, the poem and the story pages
- `music/`        music1-3.mp3 and music1-3.jpg (names in `js/tracks.js`)
- `photos/<room>/` 1.jpg, 2.jpg ... for each room
- `rooms/<room>.webp` the picture behind each room

Testing: add `?preview` (no audio files needed) and `?reset` (clears saved progress) to the page link.

Look: the page background is `bg.webp`. On the cabinet, baby Mimi (`fx/mimi.svg`) floats beside it with her guardian angel (`fx/angel.svg`); `FX.mascot()` in `js/fx.js` hides them in rooms, popups and the music panel. The moon (`.moonbg` in `css/fx.css`) sits at the cabinet's top left.
