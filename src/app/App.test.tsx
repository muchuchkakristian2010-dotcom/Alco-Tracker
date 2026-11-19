// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import { formatDayShort, todayKey } from "../core/dates";

const STORAGE_KEY = "nit.days.v1";

function readRows(): { date: string; status: string; note: string | null }[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as { date: string; status: string; note: string | null }[]) : [];
}

beforeEach(() => {
  window.localStorage.clear();
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
});

afterEach(cleanup);

it("приложение стартует с пустой историей и явно показывает «не отмечено»", async () => {
  render(<App />);

  expect(screen.getByText("История пока пуста")).toBeTruthy();
  expect(
    screen.getByText("Сегодня пока не отмечено. Серия не считается, пока вы не отметите день.")
  ).toBeTruthy();
  expect(screen.getByText(/день подряд|дня подряд|дней подряд/)).toBeTruthy();
  expect(readRows()).toHaveLength(0);
  expect(screen.getByRole("status").textContent).toMatch(/Не отмечено/);
});

it("отметка дня сохраняется локально и меняет серию", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /Отметить без алкоголя/ }));

  await waitFor(() => expect(readRows()).toHaveLength(1));
  const rows = readRows();
  expect(rows[0].date).toBe(todayKey());
  expect(rows[0].status).toBe("alcohol_free");

  await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/Без алкоголя/));
  expect(screen.getByText(/день подряд/)).toBeTruthy();
  expect(screen.queryByText("История пока пуста")).toBeNull();
});

it("открытый редактор позволяет удалить отметку — день становится неотмеченным", async () => {
  render(<App />);

  fireEvent.click(screen.getByRole("button", { name: /Отметить алкоголь/ }));
  await waitFor(() => expect(readRows()).toHaveLength(1));

  fireEvent.click(screen.getByRole("button", { name: "Календарь" }));
  await screen.findByText(/в месяце/);

  const label = new RegExp(`^${formatDayShort(todayKey())}, Алкоголь$`);
  const cell = await screen.findByLabelText(label);
  fireEvent.click(cell);

  const dialog = await screen.findByRole("dialog");
  fireEvent.click(within(dialog).getByRole("button", { name: /Удалить отметку/ }));

  await waitFor(() => expect(readRows()).toHaveLength(0));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(await screen.findByLabelText(new RegExp(`^${formatDayShort(todayKey())}, Не отмечено$`))).toBeTruthy();
});

it("статистика переключается между неделей и месяцем", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Отметить без алкоголя/ }));
  await waitFor(() => expect(readRows()).toHaveLength(1));

  fireEvent.click(screen.getByRole("button", { name: "Статистика" }));
  const week = await screen.findByRole("button", { name: "Неделя" });
  expect(week.getAttribute("aria-pressed")).toBe("true");

  expect(screen.getByText("последние 7 дней")).toBeTruthy();
  expect(screen.getByText("без алкоголя")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Месяц" }));
  expect(screen.getByText("текущий месяц")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Месяц" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByText(/все дни периода отмечены|остались без отметки/)).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Год" }));
  expect(screen.getByRole("button", { name: "Год" }).getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByText("текущий год")).toBeTruthy();
  expect(screen.getByText(/12 месяцев/)).toBeTruthy();
});

it("календарь поддерживает просмотр за весь год, а тема по умолчанию — тёмная с названием «Ясно»", async () => {
  render(<App />);
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(screen.getByText("Ясно")).toBeTruthy();

  // Переключение в светлую тему и обратно
  fireEvent.click(screen.getByRole("button", { name: /Включить светлую тему/ }));
  expect(document.documentElement.dataset.theme).toBe("light");

  fireEvent.click(screen.getByRole("button", { name: "Календарь" }));
  const yearModeBtn = await screen.findByRole("button", { name: "Год (12 месяцев)" });
  fireEvent.click(yearModeBtn);
  expect(yearModeBtn.getAttribute("aria-pressed")).toBe("true");
  expect(screen.getByText(/в году/)).toBeTruthy();
});

it("настройки меняют язык интерфейса на украинский и английский", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Настройки" }));
  await screen.findByRole("button", { name: "Українська" });

  fireEvent.click(screen.getByRole("button", { name: "Українська" }));
  expect(document.documentElement.lang).toBe("uk");
  expect(screen.getByRole("button", { name: "Сьогодні" })).toBeTruthy();
  expect(screen.getByText("календар днів")).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "English" }));
  expect(document.documentElement.lang).toBe("en");
  expect(screen.getByRole("button", { name: "Today" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Delete all history" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Русский" }));
  expect(document.documentElement.lang).toBe("ru");
  expect(screen.getByRole("button", { name: "Удалить всю историю" })).toBeTruthy();
});

it("настройки удаляют всю историю с подтверждением", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Отметить без алкоголя/ }));
  await waitFor(() => expect(readRows()).toHaveLength(1));

  fireEvent.click(screen.getByRole("button", { name: "Настройки" }));
  const clear = await screen.findByRole("button", { name: /Удалить всю историю/ });
  fireEvent.click(clear);

  const confirmButton = await screen.findByRole("button", { name: "Да, удалить" });
  fireEvent.click(confirmButton);

  await waitFor(() => expect(readRows()).toHaveLength(0));
  expect(await screen.findByText("История удалена. Приложение начинается с чистой страницы.")).toBeTruthy();
});
