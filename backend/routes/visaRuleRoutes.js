import { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  getVisaRules,
  getUniqueDestinationCountries,
  getVisaRuleDetailsByPassport,
  importVisaRulesCsv,
  updateVisaRuleByPassport,
} from "../controllers/visaRuleController.js";

const router = Router();

router.get("/", getVisaRules);
router.get("/destinations/countries", getUniqueDestinationCountries);
router.get("/passport/:passport", getVisaRuleDetailsByPassport);
router.patch("/passport/:passport", updateVisaRuleByPassport);
router.post(
  "/import-csv",
  upload.fields([
    { name: "visa-requirement-file", maxCount: 1 },
    { name: "visa-duration-file", maxCount: 1 },
  ]),
  importVisaRulesCsv,
);

export default router;
