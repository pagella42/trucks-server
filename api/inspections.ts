import express, { Request, Response } from "express";
import { parseXmlToJson } from "../helpers/parseXmlToJson.js";
import { INSPECTIONS_URL } from "../constants/urls.js";
import { DateSortingParamType, basicFilterType } from "../types/sorting.js";
import { sortInspectionsByDate } from "../helpers/sorting.js";
import { filterInspections } from "../helpers/filters.js";
import { parseVehicleData } from "../helpers/parseVehicleInfo.js";
import { getVpicUrl } from "../helpers/getVpicUrl.js";

const router = express.Router();

router.get("/inspections", async (req: Request, res: Response) => {
  try {
    //query params
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 20;
    let basicFilter: basicFilterType = req.query.basicFilter as basicFilterType;
    let sortDate: DateSortingParamType = req.query
      .sortDate as DateSortingParamType;

    //fetchig
    const response = await fetch(INSPECTIONS_URL);
    const data = await response.text();

    //parsing
    const parsedData = parseXmlToJson(data);

    //sorting and filters
    let filteredInspections = parsedData?.inspections || [];
    if (basicFilter) {
      basicFilter = decodeURIComponent(basicFilter.replace(/\+/g, " "));
    }
    filteredInspections = filterInspections(filteredInspections, basicFilter);
    filteredInspections = sortInspectionsByDate(filteredInspections, sortDate);

    //pagination
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
    //params
    const vin = req.params.vin;
    if (!vin) throw new Error("VIN is required");

    //fetching
    const url = getVpicUrl(vin);
    const response = await fetch(url);
    const data = await response.json();

    //parsing
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
