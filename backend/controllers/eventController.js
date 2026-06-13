import { Readable } from "stream";
import csvParser from "csv-parser";
import Event from "../models/Event.js";

const REQUIRED_COLUMNS = ["Event Name", "Short Description", "Destination"];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.replace(/\uFEFF/g, "").trim(),
      typeof value === "string" ? value.trim() : value,
    ]),
  );

const buildSections = (row) => {
  const sections = [];

  for (let i = 1; i <= 20; i++) {
    const title = row[`Section ${i} Title`];
    const image = row[`Section ${i} Image`];
    const content = row[`Section ${i} Content`];

    if (title || image || content) {
      sections.push({
        title: title || "",
        image: image || "",
        content: content || "",
      });
    }
  }

  return sections;
};

const buildEvent = (row) => ({
  serialNumber: row["S. No"] || "",
  link: row["Link"] || "",
  mainImage: row["Main Image URL"] || "",
  eventName: row["Event Name"],
  shortDescription: row["Short Description"],
  category: row["Category"] || "",
  month: row["Month"] || "",
  venue: row["Venue"] || "",
  destination: row["Destination"],
  eventType: row["Type"] || "",
  sections: buildSections(row),
});

export const getEvents = async (req, res, next) => {
  try {
    const { destination, category, month } = req.query;
    const query = {};

    if (destination) {
      query.destination = {
        $regex: `^${escapeRegex(destination)}$`,
        $options: "i",
      };
    }
    if (category) {
      query.category = { $regex: escapeRegex(category), $options: "i" };
    }
    if (month) {
      query.month = { $regex: escapeRegex(month), $options: "i" };
    }

    const events = await Event.find(query).sort({ destination: 1, eventName: 1 });
    return res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const bulkInsertEvents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file." });
    }

    const rows = [];
    const errors = [];
    let rowNumber = 1;

    const parser = Readable.from(req.file.buffer.toString("utf-8")).pipe(
      csvParser(),
    );

    parser.on("data", (rawRow) => {
      rowNumber++;
      const row = normalizeRow(rawRow);
      const hasAnyValue = Object.values(row).some(
        (value) => value !== undefined && value !== null && value !== "",
      );

      if (!hasAnyValue) return;

      for (const column of REQUIRED_COLUMNS) {
        if (!row[column]) {
          errors.push({
            row: rowNumber,
            field: column,
            reason: "Required field missing",
          });
        }
      }

      rows.push(row);
    });

    parser.on("error", next);

    parser.on("end", async () => {
      if (errors.length > 0) {
        return res.status(400).json({
          message: "CSV validation failed. No events were inserted.",
          errorCount: errors.length,
          errors,
        });
      }

      if (rows.length === 0) {
        return res.status(400).json({
          message: "The CSV file does not contain any event rows.",
        });
      }

      try {
        const events = rows.map(buildEvent);
        await Event.insertMany(events, { ordered: true });

        return res.status(201).json({
          message: "Events uploaded successfully",
          count: events.length,
        });
      } catch (error) {
        return next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};
