import { CarrierData } from "../types/inspections.js";
import * as xml2js from "xml-js";

export const parseXmlToJson = (xml: string): CarrierData => {
  const options = {
    compact: true,
    ignoreComment: true,
    spaces: 4,
    alwaysChildren: true,
    nativeTypeAttributes: true,
  };

  try {
    const result = xml2js.xml2json(xml, options);
    const jsonParsed = JSON.parse(result);
    const carrierData = jsonParsed.carrierData;

    const ensureArray = (obj: any) => Array.isArray(obj) ? obj : obj ? [obj] : [];
    const parseString = (value: any) => value !== undefined ? String(value) : undefined;
    const parseNumber = (value: any) => {
      const parsed = Number(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    const transformVehicle = (veh: any) => ({
      ...veh._attributes,
      unit: parseNumber(veh._attributes?.unit),
      vehicle_id_number: parseString(veh._attributes?.vehicle_id_number),
      unit_type: parseString(veh._attributes?.unit_type),
      license_state: parseString(veh._attributes?.license_state),
      license_number: parseString(veh._attributes?.license_number),
    });

    const transformViolation = (viol: any) => ({
      ...viol._attributes,
      code: parseString(viol._attributes?.code),
      description: parseString(viol._attributes?.description),
      oos: parseString(viol._attributes?.oos),
      time_severity_weight: parseNumber(viol._attributes?.time_severity_weight),
      BASIC: parseString(viol._attributes?.BASIC),
      unit: parseString(viol._attributes?.unit),
    });

    const transformedInspections = ensureArray(carrierData?.inspections?.inspection).map((insp: any) => ({
      ...insp._attributes,
      level: parseNumber(insp._attributes.level),
      time_weight: parseNumber(insp._attributes.time_weight),
      vehicles: ensureArray(insp.vehicles?.vehicle).map(transformVehicle),
      violations: ensureArray(insp.violations?.violation).map(transformViolation),
    }));

    const transformedCrashes = ensureArray(carrierData?.crashes?.crash).map((crash: any) => ({
      ...crash._attributes,
    }));

    return {
      inspections: transformedInspections,
      crashes: transformedCrashes,
    };
  } catch (error) {
    throw error;
  }
};
