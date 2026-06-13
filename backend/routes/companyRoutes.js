import { Router } from "express";
import upload from "../config/multerConfig.js";
import {
  bulkInsertCompanies,
  getCompaniesData,
  getCompanyData,
  getUniqueDataLocations,
  addCompanyImage,
  addCompanyImagesBulk,
  editCompany,
  getCompany,
  getAllLeads,
  getCompanyLeads,
  createCompany,
  getListings,
  addTemplateLink,
  activateProduct,
  updateLeads,
  bulkUpdateCompanyInclusions,
  deactivateProduct,
  editCompanyImagesBulk,
  getCompaniesDataNomads,
  getCompaniesDataMaster,
} from "../controllers/compayControllers.js";

const router = Router();
router.post(
  "/bulk-insert-companies",
  upload.single("companies"),
  bulkInsertCompanies
);

router.patch(
  "/bulk-update-companies",
  upload.single("inclusions"),
  bulkUpdateCompanyInclusions
);

router.get("/companies", getCompaniesData);
router.get("/companiesn", getCompaniesDataNomads);
router.get("/companiesma", getCompaniesDataMaster);
router.patch("/activate-product", activateProduct);
router.patch("/deactivate-product", deactivateProduct);
router.get("/get-single-company-data", getCompanyData);
router.get("/get-listings/:companyId", getListings);
router.get("/get-company-data/:companyName", getCompany); //check company from admin panel before adding website link after creating website.
router.get("/company-locations", getUniqueDataLocations);
router.patch("/update-company", upload.any(), editCompany);
router.patch("/add-template-link", addTemplateLink);
router.post("/add-company-image", upload.single("image"), addCompanyImage);
router.post(
  "/bulk-add-company-images",
  upload.array("images", 10),
  addCompanyImagesBulk
);
router.patch(
  "/bulk-edit-company-images",
  upload.array("images", 10),
  editCompanyImagesBulk
);

router.post("/create-company", upload.any(), createCompany);
router.get("/all-leads", getAllLeads);
router.get("/leads", getCompanyLeads);
router.patch("/update-lead", updateLeads);

export default router;
