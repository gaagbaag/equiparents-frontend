"use client";

import { useSelector } from "react-redux";
import { format } from "date-fns";

export default function useFilteredEvents({
  filterCategory,
  filterChild,
  filterDate,
}: {
  filterCategory?: string;
  filterChild?: string;
  filterDate?: string;
}) {
  const events = useSelector((state: any) => state.calendar.events);

  return events.filter((event: any) => {
    const matchCategory = filterCategory
      ? event.category?.id === filterCategory
      : true;

    const childIds = event.children?.map((c: any) => c.child?.id) || [];
    const matchChild = filterChild ? childIds.includes(filterChild) : true;

    const matchDate = filterDate
      ? format(new Date(event.start), "yyyy-MM-dd") === filterDate
      : true;

    return matchCategory && matchChild && matchDate;
  });
}
