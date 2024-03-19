import { ParsedOutput } from "../types/vehicleInfo.js";
import { toCamelCase } from "../utils/toCamelCase.js";

export function parseVehicleData(inputJson: any): ParsedOutput {
  const data = inputJson as { Variable: string; Value: string }[];

  if (
    data.find(
      (item: { Variable: string; Value: string }) =>
        item.Variable === "Error Code"
    ).Value !== "0"
  ) {
    throw new Error("Invalid VIN");
  }

  const vehicleVariables = [
    "Make",
    "Vehicle Descriptor",
    "Manufacturer Name",
    "Model",
    "Model Year",
    "Drive Type",
    "Brake System Type",
    "Fuel Type - Primary",
  ];
  const plantVariables = [
    "Plant City",
    "Plant Country",
    "Plant Company Name",
    "Plant State",
  ];

  const output: ParsedOutput = { vehicle: {}, plant: {} };

  data.forEach((item) => {
    const camelCaseVariable = toCamelCase(item.Variable);
    if (vehicleVariables.includes(item.Variable)) {
      output.vehicle[camelCaseVariable] = item.Value;
    } else if (plantVariables.includes(item.Variable)) {
      output.plant[camelCaseVariable] = item.Value;
    }
  });
  return output;
}
