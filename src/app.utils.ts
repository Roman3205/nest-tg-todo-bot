import { Task } from "generated/prisma";

export const showTodoList = (todos: Task[]): string => {
  return `Your todo list: \n\n${todos.map((todo) => (todo.isCompleted ? '✅' : '🔘') + ' ' + todo.title + '\n\n').join('')}`;
};
