import express, { Request, Response } from "express";
import { parseXmlToJson } from "../helpers/parseXmlToJson.js";
import {
  INSPECTIONS_URL,
  VPIC_URL,
  VPIC_URL_PARAMS,
} from "../constants/urls.js";
import { DateSortingType } from "../types/sorting.js";
import { sortInspectionsByDate } from "../helpers/sorting.js";
import { filterInspections } from "../helpers/filters.js";
import { parseVehicleData } from "../helpers/parseVehicleInfo.js";

const router = express.Router();

router.get("/inspections", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 20;
    let basicFilter: string | undefined = req.query.basicFilter as
      | string
      | undefined;
    let sortDate: DateSortingType | undefined = req.query.sortDate as
      | DateSortingType
      | undefined;

    if (basicFilter) {
      basicFilter = decodeURIComponent(basicFilter.replace(/\+/g, " "));
    }

    const response = await fetch(INSPECTIONS_URL);
    const data = await response.text();
    const parsedData = parseXmlToJson(data);

    let filteredInspections = parsedData?.inspections || [];

    filteredInspections = filterInspections(filteredInspections, basicFilter);

    filteredInspections = sortInspectionsByDate(filteredInspections, sortDate);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = filteredInspections.slice(startIndex, endIndex);

    res.send({
      status: 200,
      data: {
        totalItems: filteredInspections.length,
        inspections: pageItems,
      },
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      errorMessage: "Error retrieving inspections",
    });
  }
});

router.get("/vehicleinfo/:vin", async (req: Request, res: Response) => {
  try {
    const vin = req.params.vin;
    if (!vin) throw new Error("VIN is required");

    const url = `${VPIC_URL}${vin}${VPIC_URL_PARAMS}`;

    const response = await fetch(url);
    const data = await response.json();

    const parsedData = parseVehicleData(data.Results);

    res.send({
      status: 200,
      data: parsedData,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      errorMessage: "Error retrieving vehicle info",
    });
  }
});

export default router;
