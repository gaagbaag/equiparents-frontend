// src/types/calendar.ts

export type CalendarCategory = {
  id: string;
  name: string;
};

export type CalendarTag = {
  id: string;
  name: string;
};

export type Child = {
  id: string;
  firstName: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  category?: CalendarCategory;
  children?: { child: Child }[];
};
