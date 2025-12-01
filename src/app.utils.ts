type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
  chatId: number;
  createdAt: Date;
  updatedAt: Date;
};

export const showTodoList = (todos: Task[]): string => {
  return `Your todo list: \n\n${todos.map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.title + '\n\n').join('')}`;
};
