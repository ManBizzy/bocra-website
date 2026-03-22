import fs from "fs/promises";
import path from "path";
import XLSX from "xlsx";

const SOURCE_URL =
  "https://www.bocra.org.bw/sites/default/files/LATEST%20BOCRA%20LICENSEE%20LIST%20AS%20%40%20END%20OF%20MARCH%202025....xlsx";
const OUTPUT_PATH = path.resolve(
  import.meta.dirname,
  "..",
  "client",
  "src",
  "data",
  "licenceRegisterData.ts"
);

const normalizeCell = value => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return value;
  }

  return String(value).replace(/\s+/g, " ").trim();
};

const slugify = value =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isBlank = value =>
  value === "" || value === null || value === undefined || Number.isNaN(value);

const onlyOneMeaningfulCell = row =>
  row.filter(cell => !isBlank(cell)).length === 1;

const looksLikeHeading = value =>
  typeof value === "string" &&
  value.length > 0 &&
  value === value.toUpperCase() &&
  /[A-Z]/.test(value);

function toIsoDate(value) {
  if (typeof value !== "number") {
    return "";
  }

  const parsed = XLSX.SSF.parse_date_code(value);

  if (!parsed) {
    return "";
  }

  const year = String(parsed.y).padStart(4, "0");
  const month = String(parsed.m).padStart(2, "0");
  const day = String(parsed.d).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function headerLooksLikeDate(header = "") {
  const normalizedHeader = String(header).toLowerCase();

  return (
    normalizedHeader.includes("date") ||
    normalizedHeader.includes("issued") ||
    normalizedHeader.includes("expiry") ||
    normalizedHeader.includes("authorisation")
  );
}

function toDisplayValue(value, header = "") {
  if (typeof value === "number") {
    if (headerLooksLikeDate(header)) {
      const iso = toIsoDate(value);
      if (iso) {
        return iso;
      }
    }

    return Number.isInteger(value) ? String(value) : String(value);
  }

  return normalizeCell(value);
}

function createRecord(headers, row, startCol = 0) {
  return headers.reduce((record, header, index) => {
    const key = slugify(header) || `column-${index + 1}`;
    record[key] = toDisplayValue(row[startCol + index], header);
    return record;
  }, {});
}

function parseSimpleTableSheet(label, rows, headerRowIndex, dataStartIndex) {
  const headers = rows[headerRowIndex]
    .map(normalizeCell)
    .filter(Boolean)
    .map(String);
  const sections = [];
  let currentSection = label;

  for (const rawRow of rows.slice(dataStartIndex)) {
    const row = rawRow.map(normalizeCell);

    if (row.every(isBlank)) {
      continue;
    }

    if (
      typeof row[0] === "string" &&
      row[0] &&
      row.slice(1).every(isBlank) &&
      !headers.includes(row[0])
    ) {
      currentSection = row[0];
      continue;
    }

    if (typeof row[0] !== "number") {
      continue;
    }

    let section = sections.find(entry => entry.label === currentSection);

    if (!section) {
      section = {
        id: slugify(`${label}-${currentSection}`),
        label: currentSection,
        columns: headers,
        rows: [],
      };
      sections.push(section);
    }

    section.rows.push(createRecord(headers, row));
  }

  return sections;
}

function parseOnlineServices(rows) {
  const leftLabel = normalizeCell(rows[0]?.[0]) || "IPTV";
  const rightLabel = normalizeCell(rows[0]?.[4]) || "Online Radio";
  const leftHeaders = rows[1].slice(0, 3).map(normalizeCell);
  const rightHeaders = rows[1].slice(4, 7).map(normalizeCell);
  const leftRows = [];
  const rightRows = [];

  for (const rawRow of rows.slice(2)) {
    const row = rawRow.map(normalizeCell);

    if (typeof row[0] === "number") {
      leftRows.push(createRecord(leftHeaders, row, 0));
    }

    if (typeof row[4] === "number") {
      rightRows.push(createRecord(rightHeaders, row, 4));
    }
  }

  return [
    {
      id: slugify(leftLabel),
      label: leftLabel,
      columns: leftHeaders,
      rows: leftRows,
    },
    {
      id: slugify(rightLabel),
      label: rightLabel,
      columns: rightHeaders,
      rows: rightRows,
    },
  ];
}

function parsePostalServices(rows) {
  const mainHeaders = rows[0].slice(0, 5).map(normalizeCell);
  const provisionalHeaders = [
    "No.",
    "Licence no.",
    "Name of Company",
    "Date issued",
    "Expiry date",
  ];
  const sections = [];
  let currentMainSection = "Postal services";

  for (const rawRow of rows.slice(1)) {
    const row = rawRow.map(normalizeCell);

    if (row.every(isBlank)) {
      continue;
    }

    if (
      typeof row[0] === "string" &&
      row[0] &&
      row.slice(1, 5).every(isBlank)
    ) {
      currentMainSection = row[0];
      continue;
    }

    if (typeof row[0] === "number") {
      let section = sections.find(entry => entry.label === currentMainSection);

      if (!section) {
        section = {
          id: slugify(`postal-${currentMainSection}`),
          label: currentMainSection,
          columns: mainHeaders,
          rows: [],
        };
        sections.push(section);
      }

      section.rows.push(createRecord(mainHeaders, row, 0));
    }
  }

  const provisionalRows = [];

  for (const rawRow of rows.slice(5)) {
    const row = rawRow.map(normalizeCell);

    if (typeof row[6] === "number") {
      provisionalRows.push(createRecord(provisionalHeaders, row, 6));
    }
  }

  if (provisionalRows.length > 0) {
    sections.push({
      id: "postal-provisional-licences",
      label: "Provisional Licences",
      columns: provisionalHeaders,
      rows: provisionalRows,
    });
  }

  return sections;
}

function parseNameListSheet(label, rows) {
  const sections = [];
  let currentSection = label;
  const categoryHeadings = new Set(["ICT", "POSTAL", "BROADCASTING", "ONLINE"]);

  for (const rawRow of rows) {
    const row = rawRow.map(normalizeCell);
    const firstCell = row[0];

    if (isBlank(firstCell)) {
      continue;
    }

    if (
      onlyOneMeaningfulCell(row) &&
      looksLikeHeading(firstCell) &&
      categoryHeadings.has(firstCell)
    ) {
      currentSection = firstCell;
      continue;
    }

    let section = sections.find(entry => entry.label === currentSection);

    if (!section) {
      section = {
        id: slugify(`${label}-${currentSection}`),
        label: currentSection,
        columns: ["Name"],
        rows: [],
      };
      sections.push(section);
    }

    section.rows.push({ name: toDisplayValue(firstCell) });
  }

  return sections;
}

function parseKpiSheet(rows) {
  const yearRow = rows[0].map(normalizeCell);
  const periodRow = rows[1].map(normalizeCell);
  const periods = [];
  let currentYear = "";

  for (let columnIndex = 2; columnIndex < yearRow.length; columnIndex += 1) {
    if (typeof yearRow[columnIndex] === "number") {
      currentYear = String(yearRow[columnIndex]);
    } else if (typeof yearRow[columnIndex] === "string" && yearRow[columnIndex]) {
      currentYear = yearRow[columnIndex];
    }

    const periodLabel =
      typeof periodRow[columnIndex] === "string" ? periodRow[columnIndex] : "";

    if (!currentYear && !periodLabel) {
      continue;
    }

    periods.push({
      index: columnIndex,
      key: slugify(`${currentYear}-${periodLabel || columnIndex}`),
      year: currentYear,
      label: periodLabel || `Period ${periods.length + 1}`,
    });
  }

  const groups = [];
  let currentGroup = "";

  for (const rawRow of rows.slice(2)) {
    const row = rawRow.map(normalizeCell);
    const groupLabel =
      typeof row[0] === "string" && row[0] ? row[0] : currentGroup;
    const seriesLabel =
      typeof row[1] === "string" && row[1] ? row[1] : groupLabel;
    const values = periods
      .map(period => ({
        periodKey: period.key,
        year: String(period.year),
        label: period.label,
        value:
          typeof row[period.index] === "number"
            ? row[period.index]
            : Number.isFinite(Number(row[period.index]))
              ? Number(row[period.index])
              : null,
      }))
      .filter(entry => entry.value !== null);

    if (!groupLabel || values.length === 0) {
      continue;
    }

    currentGroup = groupLabel;

    let group = groups.find(entry => entry.label === groupLabel);

    if (!group) {
      group = {
        id: slugify(groupLabel),
        label: groupLabel,
        series: [],
      };
      groups.push(group);
    }

    group.series.push({
      id: slugify(`${groupLabel}-${seriesLabel}`),
      label: seriesLabel,
      latestValue: values[0]?.value ?? null,
      values,
    });
  }

  return { periods, groups };
}

async function main() {
  const response = await fetch(SOURCE_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch licence register workbook: ${response.status}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: "buffer" });
  const sheets = workbook.SheetNames.map(sheetName => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
      raw: true,
      defval: "",
    });

    if (sheetName === "Online services") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: parseOnlineServices(rows),
      };
    }

    if (sheetName === "Broadcasting Services") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: parseSimpleTableSheet(sheetName, rows, 0, 1),
      };
    }

    if (sheetName === "SAP licences" || sheetName === "NFP Licences") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: parseSimpleTableSheet(sheetName, rows, 1, 2),
      };
    }

    if (sheetName === "Postal services") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: parsePostalServices(rows),
      };
    }

    if (sheetName === "REVOKED" || sheetName === "SURRENDERED & CANCELLED") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: parseNameListSheet(sheetName, rows),
      };
    }

    if (sheetName === "KEY PERFORMANCE INDICATORS") {
      return {
        id: slugify(sheetName),
        label: sheetName,
        sections: [],
        kpi: parseKpiSheet(rows),
      };
    }

    return {
      id: slugify(sheetName),
      label: sheetName,
      sections: [],
    };
  });

  const activeSheets = sheets.filter(sheet => sheet.label !== "KEY PERFORMANCE INDICATORS");
  const kpiSheet = sheets.find(sheet => sheet.label === "KEY PERFORMANCE INDICATORS");
  const totalRecords = activeSheets.reduce(
    (count, sheet) =>
      count +
      sheet.sections.reduce((sectionCount, section) => sectionCount + section.rows.length, 0),
    0
  );
  const totalKpiSeries = kpiSheet?.kpi?.groups.reduce(
    (count, group) => count + group.series.length,
    0
  ) ?? 0;

  const output = `export const LICENCE_REGISTER_SOURCE_URL = ${JSON.stringify(
    SOURCE_URL
  )} as const;

export const LICENCE_REGISTER_DATA = ${JSON.stringify(
    {
      sourceLabel: "Latest BOCRA Licensee List as at end of March 2025",
      syncedAt: new Date().toISOString(),
      totalRecords,
      totalKpiSeries,
      sheets: activeSheets,
      kpi: kpiSheet?.kpi ?? { periods: [], groups: [] },
    },
    null,
    2
  )} as const;
`;

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, output);

  console.log(
    `Synced licence register data: ${totalRecords} register rows, ${totalKpiSeries} KPI series`
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
