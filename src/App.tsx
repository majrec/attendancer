import React, { useMemo, useState } from "react";

const STATUS_OPTIONS = [
  { value: "on-site", label: "On-site 🚗", background: "#dbeafe", border: "#93c5fd" },
  
  { value: "home-office", label: "Home office", background: "#fce7f3", border: "#f9a8d4" },
  { value: "telework", label: "Telework", background: "#dcfce7", border: "#86efac" },
  { value: "other", label: "Other", background: "#f3e8ff", border: "#d8b4fe" },
];

const MONTH_LIMITS = {
  telework: 8,
  "home-office": 4,
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dancerEmoji = "🕺📋";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f1f5f9 0%, #ffffff 50%, #e2e8f0 100%)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: "1180px",
    margin: "0 auto",
  },
  headerBlock: {
    marginBottom: "24px",
    textAlign: "center",
  },
  heroImageWrap: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  heroImage: {
    fontSize: "56px",
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    border: "1px solid #fcd34d",
  },
  eyebrow: {
    fontSize: "14px",
    color: "#475569",
    marginBottom: "8px",
  },
  title: {
    fontSize: "36px",
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.5,
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  monthTitle: {
    fontSize: "24px",
    fontWeight: 700,
    margin: 0,
    textAlign: "center",
    flex: 1,
  },
  controlsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  navButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  fillButton: {
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    color: "#1e3a8a",
    borderRadius: "12px",
    padding: "10px 14px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
  statPillGreen: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
  },
  statPillPink: {
    border: "1px solid #fbcfe8",
    background: "#fdf2f8",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "14px",
  },
  cardContent: {
    padding: "20px",
  },
  weekdaysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "8px",
    marginBottom: "12px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 600,
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "8px",
  },
  emptyCell: {
    minHeight: "96px",
    borderRadius: "14px",
    background: "#f8fafc",
  },
  dayCell: {
    minHeight: "96px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "8px",
    boxSizing: "border-box",
  },
  dayHead: {
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  dayNumber: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#334155",
  },
  holidayBadge: {
    background: "rgba(255,255,255,0.8)",
    borderRadius: "999px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: 600,
    color: "#c2410c",
  },
  select: {
    width: "100%",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    padding: "0 10px",
    fontSize: "12px",
    color: "#0f172a",
  },
  footer: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: "12px",
    color: "#64748b",
  },
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getEasterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getSlovakHolidays(year) {
  const easterSunday = getEasterSunday(year);
  const goodFriday = addDays(easterSunday, -2);
  const easterMonday = addDays(easterSunday, 1);

  return new Set([
    `${year}-01-01`,
    `${year}-01-06`,
    formatDateKey(goodFriday),
    formatDateKey(easterMonday),
    `${year}-05-01`,
    `${year}-05-08`,
    `${year}-07-05`,
    `${year}-08-29`,
    `${year}-09-01`,
    `${year}-09-15`,
    `${year}-11-01`,
    `${year}-11-17`,
    `${year}-12-24`,
    `${year}-12-25`,
    `${year}-12-26`,
  ]);
}

function getMonthSelectionCounts(selectionMap, monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  return Object.entries(selectionMap).reduce(
    (acc, [key, value]) => {
      const date = new Date(`${key}T00:00:00`);
      if (date.getFullYear() === year && date.getMonth() === month) {
        if (value === "telework") acc.telework += 1;
        if (value === "home-office") acc.homeOffice += 1;
      }
      return acc;
    },
    { telework: 0, homeOffice: 0 }
  );
}

function getDayStyle({ isToday, isWeekend, isHoliday, selectedOption }) {
  if (isHoliday) {
    return { ...styles.dayCell, background: "#ffedd5", border: "1px solid #fdba74" };
  }

  if (isWeekend) {
    return { ...styles.dayCell, background: "#f1f5f9", border: "1px solid #e2e8f0" };
  }

  if (selectedOption) {
    return {
      ...styles.dayCell,
      background: selectedOption.background,
      border: `1px solid ${selectedOption.border}`,
    };
  }

  if (isToday) {
    return { ...styles.dayCell, background: "#f8fafc", border: "1px solid #0f172a" };
  }

  return styles.dayCell;
}

function MonthCalendar({
  monthDate,
  selections,
  onChange,
  onFillMonthOnSite,
  onPreviousMonth,
  onNextMonth,
}) {
  const monthCells = useMemo(() => getMonthDays(monthDate), [monthDate]);
  const holidays = useMemo(() => getSlovakHolidays(monthDate.getFullYear()), [monthDate]);
  const todayKey = formatDateKey(new Date());
  const monthCounts = getMonthSelectionCounts(selections, monthDate);
  const teleworkRemaining = MONTH_LIMITS.telework - monthCounts.telework;
  const homeOfficeRemaining = MONTH_LIMITS["home-office"] - monthCounts.homeOffice;

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.navRow}>
          <button type="button" style={styles.navButton} onClick={onPreviousMonth}>
            ← Previous
          </button>

          <h2 style={styles.monthTitle}>{getMonthLabel(monthDate)}</h2>

          <button type="button" style={styles.navButton} onClick={onNextMonth}>
            Next →
          </button>
        </div>

        <div style={styles.controlsRow}>
          <button type="button" style={styles.fillButton} onClick={() => onFillMonthOnSite(monthDate)}>
            Fill free days with On-site
          </button>

          <div style={styles.statPillGreen}>
            <span style={{ color: "#475569" }}>Telework remaining: </span>
            <strong>
              {teleworkRemaining} / {MONTH_LIMITS.telework}
            </strong>
          </div>

          <div style={styles.statPillPink}>
            <span style={{ color: "#475569" }}>Home office remaining: </span>
            <strong>
              {homeOfficeRemaining} / {MONTH_LIMITS["home-office"]}
            </strong>
          </div>
        </div>
      </div>

      <div style={styles.cardContent}>
        <div style={styles.weekdaysGrid}>
          {WEEKDAYS.map((weekday) => (
            <div key={weekday}>{weekday}</div>
          ))}
        </div>

        <div style={styles.calendarGrid}>
          {monthCells.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} style={styles.emptyCell} />;
            }

            const dateKey = formatDateKey(date);
            const selectedValue = selections[dateKey] || "__none__";
            const isToday = dateKey === todayKey;
            const weekdayNumber = date.getDay();
            const isWeekend = weekdayNumber === 0 || weekdayNumber === 6;
            const isHoliday = holidays.has(dateKey);
            const selectedOption = STATUS_OPTIONS.find((option) => option.value === selectedValue);
            const isNonWorkingDay = isWeekend || isHoliday;

            return (
              <div
                key={dateKey}
                style={getDayStyle({ isToday, isWeekend, isHoliday, selectedOption })}
              >
                <div style={styles.dayHead}>
                  <span style={styles.dayNumber}>{date.getDate()}</span>
                  {isHoliday && <span style={styles.holidayBadge}>Holiday</span>}
                </div>

                {!isNonWorkingDay && (
                  <select
                    style={styles.select}
                    value={selectedValue}
                    onChange={(event) => onChange(dateKey, event.target.value)}
                  >
                    <option value="__none__">None</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DochadzkaKalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selections, setSelections] = useState({});

  const handleMonthShift = (direction) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const handleSelectionChange = (dateKey, value) => {
    setSelections((prev) => {
      const updated = { ...prev };
      const previousValue = updated[dateKey];

      if (value === "__none__") {
        delete updated[dateKey];
        return updated;
      }

      const selectedDate = new Date(`${dateKey}T00:00:00`);
      const monthCounts = getMonthSelectionCounts(updated, selectedDate);

      const nextTeleworkCount =
        value === "telework"
          ? monthCounts.telework + (previousValue === "telework" ? 0 : 1)
          : monthCounts.telework;

      const nextHomeOfficeCount =
        value === "home-office"
          ? monthCounts.homeOffice + (previousValue === "home-office" ? 0 : 1)
          : monthCounts.homeOffice;

      if (nextTeleworkCount > MONTH_LIMITS.telework || nextHomeOfficeCount > MONTH_LIMITS["home-office"]) {
        return prev;
      }

      updated[dateKey] = value;
      return updated;
    });
  };

  const handleFillMonthOnSite = (monthDate) => {
    setSelections((prev) => {
      const updated = { ...prev };
      const monthCells = getMonthDays(monthDate);
      const holidays = getSlovakHolidays(monthDate.getFullYear());

      monthCells.forEach((date) => {
        if (!date) return;

        const dateKey = formatDateKey(date);
        const weekdayNumber = date.getDay();
        const isWeekend = weekdayNumber === 0 || weekdayNumber === 6;
        const isHoliday = holidays.has(dateKey);
        const hasExistingSelection = Boolean(updated[dateKey]);

        if (!isWeekend && !isHoliday && !hasExistingSelection) {
          updated[dateKey] = "on-site";
        }
      });

      return updated;
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerBlock}>
          <div style={styles.heroImageWrap}>
            <div style={styles.heroImage} aria-label="funny attendance dancer illustration" title="Funny attendance dancer">
              {dancerEmoji}
            </div>
          </div>
                    <h1 style={styles.title}>Attendancer</h1>
          <p style={styles.subtitle}>
            Choose a status for each working day and switch months with the navigation above the calendar.
          </p>
        </div>

        <MonthCalendar
          monthDate={currentMonth}
          selections={selections}
          onChange={handleSelectionChange}
          onFillMonthOnSite={handleFillMonthOnSite}
          onPreviousMonth={() => handleMonthShift(-1)}
          onNextMonth={() => handleMonthShift(1)}
        />

        <div style={styles.footer}>
          <span style={styles.footerText}>Made by MV</span>
        </div>
      </div>
    </div>
  );
}
