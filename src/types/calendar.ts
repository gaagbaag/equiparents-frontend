// src/types/calendar.ts

export type CalendarCategory = {
  id: string;
  name: string;
};

export type CalendarTag = {
  id: string;
  name: string;
};

export type EventChildRef = {
  id: string;
  firstName: string;
};

export type ParentRef = {
  id: string;
  firstName: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start: string;
  end: string;
  timezone?: string;
  recurrenceRule?: string;
  meetingLink?: string;
  googleEventId?: string;
  status: "approved" | "pending" | "rejected";
  category?: CalendarCategory;
  tags?: CalendarTag[];
  children?: { child: EventChildRef }[];
  parents?: { user: ParentRef }[];
  createdBy?: { id: string };

  reminders?: {
    id: string;
    type: string;
    minutesBefore: number;
  }[];
};
