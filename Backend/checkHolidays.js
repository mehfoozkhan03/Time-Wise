// ============================================================
// HOLIDAY DATABASE DIAGNOSTIC
// ============================================================
// Run from the Backend folder:
//     node checkHolidays.js
//
// Prints every row in the holidays collection so you can see
// exactly which titles and dates the chatbot has to work with.
// Read-only - it never writes or deletes anything.
// ============================================================

import mongoose from "mongoose";

import { Connection } from "./config/db.js";
import { holidayModel } from "./models/Holidays.model.js";

const shortDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "INVALID DATE";
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });

  return `${year}-${month}-${day} (${weekday})`;
};

const run = async () => {
  await Connection();

  const all = await holidayModel.find({}).sort({ date: 1 }).lean();

  console.log("\n============================================");
  console.log(`TOTAL ROWS IN holidays COLLECTION: ${all.length}`);
  console.log("============================================\n");

  if (all.length === 0) {
    console.log("The collection is EMPTY.");
    console.log("This is why the chatbot answers");
    console.log('  "No matching information was found."');
    console.log("Seed some holidays first.\n");

    await mongoose.disconnect();
    return;
  }

  // ----------------------------------------------------------
  // 1. Every row, grouped by year
  // ----------------------------------------------------------

  const byYear = new Map();

  for (const row of all) {
    const year = new Date(row.date).getUTCFullYear();

    if (!byYear.has(year)) {
      byYear.set(year, []);
    }

    byYear.get(year).push(row);
  }

  console.log("--- ALL ROWS BY YEAR ---\n");

  for (const year of [...byYear.keys()].sort()) {
    const rows = byYear.get(year);

    console.log(`${year}  (${rows.length} rows)`);

    for (const row of rows) {
      const active = row.isActive === false ? "  [INACTIVE]" : "";

      console.log(
        `   ${shortDate(row.date)}  ${row.title}  <${row.type}>${active}`,
      );
    }

    console.log("");
  }

  // ----------------------------------------------------------
  // 2. Current year only - what "this year" queries can match
  // ----------------------------------------------------------

  const currentYear = new Date().getFullYear();

  const thisYear = byYear.get(currentYear) || [];

  console.log("============================================");
  console.log(`ROWS FOR THE CURRENT YEAR (${currentYear}): ${thisYear.length}`);
  console.log("============================================\n");

  if (thisYear.length === 0) {
    console.log(`No holiday rows exist for ${currentYear}.`);
    console.log('Named-holiday questions ("When is Janmashtami?") search');
    console.log("the current year first, then fall back to the nearest");
    console.log("other year. With zero rows for this year, only the");
    console.log("fallback can answer.\n");
  }

  // ----------------------------------------------------------
  // 3. Name search - does the chatbot's matching find them?
  // ----------------------------------------------------------
  // These are the same substring checks Phase 4 performs.
  // ----------------------------------------------------------

  const searchNames = [
    "janmashtami",
    "gandhi",
    "diwali",
    "holi",
    "christmas",
    "independence",
    "republic",
  ];

  console.log("============================================");
  console.log("NAME MATCH CHECK (same logic as the chatbot)");
  console.log("============================================\n");

  for (const name of searchNames) {
    const matches = all.filter((row) =>
      String(row.title || "")
        .toLowerCase()
        .includes(name),
    );

    if (matches.length === 0) {
      console.log(`"${name}"  ->  NO MATCH  (chatbot cannot answer this)`);
      continue;
    }

    const dates = matches.map((row) => shortDate(row.date)).join(", ");

    console.log(`"${name}"  ->  ${matches.length} row(s): ${dates}`);
  }

  // ----------------------------------------------------------
  // 4. Duplicate titles across years
  // ----------------------------------------------------------

  const titleCounts = new Map();

  for (const row of all) {
    const key = String(row.title || "").toLowerCase().trim();

    titleCounts.set(key, (titleCounts.get(key) || 0) + 1);
  }

  const repeated = [...titleCounts.entries()].filter(([, count]) => count > 1);

  console.log("\n============================================");
  console.log(`TITLES STORED FOR MULTIPLE YEARS: ${repeated.length}`);
  console.log("============================================\n");

  if (repeated.length > 0) {
    console.log("Expected - the chatbot collapses these to one date:\n");

    for (const [title, count] of repeated.sort((a, b) => b[1] - a[1])) {
      console.log(`   ${count}x  ${title}`);
    }
  }

  console.log("");

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("\nDIAGNOSTIC FAILED:");
  console.error(error.message);

  await mongoose.disconnect().catch(() => {});

  process.exit(1);
});
