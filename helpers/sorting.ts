import { DateSorting, DateSortingType } from "../types/sorting.js";
import { Inspection } from "../types/inspections.js";

export const sortInspectionsByDate = (
  inspections: Inspection[],
  sortOrder: DateSortingType
) => {
  if (
    !sortOrder ||
    (sortOrder.toUpperCase() !== DateSorting.ASC &&
      sortOrder.toUpperCase() !== DateSorting.DESC)
  ) {
    return inspections;
  }

  return inspections.sort((a, b) => {
    const dateA = new Date(a.inspection_date).getTime();
    const dateB = new Date(b.inspection_date).getTime();
    if (sortOrder.toUpperCase() === DateSorting.ASC) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};
