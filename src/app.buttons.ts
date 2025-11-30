import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Todo list 📋', 'Todo list '),
      Markup.button.callback('Done ✅', 'done'),
      Markup.button.callback('Edit todo ✏️', 'edit'),
      Markup.button.callback('Delete todo ❌', 'delete'),
    ],
    { columns: 3 },
  );
}
