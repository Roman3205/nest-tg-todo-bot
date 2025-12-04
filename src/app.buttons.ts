import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('Todo list 📋', 'list'),
      Markup.button.callback('Create ➕', 'create'),
      Markup.button.callback('Done ✅', 'done'),
      Markup.button.callback('Edit todo ✏️', 'edit'),
      Markup.button.callback('Delete todo ❌', 'delete'),
    ],
    { columns: 3 },
  );
}
