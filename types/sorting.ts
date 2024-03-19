export const DateSorting = {
  ASC: "ASC",
  DESC: "DESC",
};

export type DateSortingType = (typeof DateSorting)[keyof typeof DateSorting];
