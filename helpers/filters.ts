import { Inspection } from "../types/inspections.js";

export const filterInspections = (inspections: Inspection[], basicFilter: string) => {
  if (!basicFilter) {
    return inspections;
  }

  return inspections.filter(
    (inspection) =>
      inspection.violations.length > 0 &&
      inspection.violations[0].BASIC === basicFilter
  );
};
