import React from "react";
import AiValueAdditionForm from "./AiValueAdditionForm";

const helpGetActivatedOptions = [
  "Virtual Office",
  "Co-Working",
  "Co-Living",
  "Hostels",
  "Workation",
  "Meeting Rooms",
  "Cafes",
  "Car & Bike renting",
  "Yatch Renting",
  "Airport Pickup / Drop",
  "Company Registration Support",
  "Personalised",
];

const AiHelpGetActivated = () => (
  <AiValueAdditionForm
    title="Help You Get Activated"
    selectLabel="Service Required"
    selectFieldName="serviceRequired"
    options={helpGetActivatedOptions}
    sheetName="AI_Help_Get_Activated"
  />
);

export default AiHelpGetActivated;
