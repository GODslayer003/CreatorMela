import * as XLSX from 'xlsx';
import { SUBMISSION_TYPE_LABELS } from '@/constants';

const BRAND = {
  primary: '1B2A4A',
  accent: '4F46E5',
  light: 'EEF2FF',
  white: 'FFFFFF',
  text: '1E293B',
  muted: '64748B',
  border: 'E2E8F0',
  rowEven: 'F8FAFC',
  rowOdd: 'FFFFFF',
};

const STATUS_STYLES = {
  pending:             { bg: 'FEF3C7', fg: '92400E', label: 'Pending' },
  under_review:        { bg: 'DBEAFE', fg: '1E40AF', label: 'Under Review' },
  approved:            { bg: 'D1FAE5', fg: '065F46', label: 'Approved' },
  rejected:            { bg: 'FEE2E2', fg: '991B1B', label: 'Rejected' },
  changes_requested:   { bg: 'FFF7ED', fg: '9A3412', label: 'Changes Requested' },
  archived:            { bg: 'F1F5F9', fg: '475569', label: 'Archived' },
};

const PRIORITY_STYLES = {
  low:    { bg: 'F0FDF4', fg: '166534', label: 'Low' },
  medium: { bg: 'EFF6FF', fg: '1E40AF', label: 'Medium' },
  high:   { bg: 'FFF7ED', fg: '9A3412', label: 'High' },
  urgent: { bg: 'FEF2F2', fg: '991B1B', label: 'Urgent' },
};

const thinBorder = {
  top:    { style: 'thin', color: { rgb: BRAND.border } },
  bottom: { style: 'thin', color: { rgb: BRAND.border } },
  left:   { style: 'thin', color: { rgb: BRAND.border } },
  right:  { style: 'thin', color: { rgb: BRAND.border } },
};

function styleCell(ws, ref, style) {
  if (ws[ref]) ws[ref].s = style;
}

export function exportToExcel(data, filename = 'moderation-queue') {
  const timestamp = new Date().toISOString().split('T')[0];
  const generatedAt = new Date().toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // ── Title rows ──
  const titleRows = [
    [
      { v: 'CREATORSMELA', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: `Generated: ${generatedAt}`, t: 's' },
    ],
    [
      { v: 'Moderation Queue Export', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: `${data.length} records`, t: 's' },
    ],
    [
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' }, { v: '', t: 's' },
      { v: '', t: 's' }, { v: '', t: 's' },
    ],
  ];

  // ── Header row ──
  const headers = ['#', 'Submission', 'Type', 'Creator', 'Campaign', 'Priority', 'Status', 'Submitted', 'Reviewer', 'Tags'];
  const headerRow = headers.map((h) => ({ v: h, t: 's' }));

  // ── Data rows ──
  const dataRows = data.map((row, i) => [
    { v: i + 1, t: 'n' },
    { v: row.title, t: 's' },
    { v: SUBMISSION_TYPE_LABELS[row.type] || row.type, t: 's' },
    { v: row.creatorName, t: 's' },
    { v: row.campaignTitle || '—', t: 's' },
    { v: PRIORITY_STYLES[row.priority]?.label || row.priority, t: 's' },
    { v: STATUS_STYLES[row.status]?.label || row.status, t: 's' },
    { v: new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), t: 's' },
    { v: row.assignedTo || 'Unassigned', t: 's' },
    { v: row.tags.join(', ') || '—', t: 's' },
  ]);

  // ── Footer row ──
  const footerRow = [
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: '', t: 's' },
    { v: `Total: ${data.length} records`, t: 's' },
  ];

  const allRows = [...titleRows, headerRow, ...dataRows, footerRow];
  const ws = XLSX.utils.aoa_to_sheet(allRows);

  // ── Column widths ──
  ws['!cols'] = [
    { wch: 5 },   { wch: 36 },  { wch: 18 },  { wch: 22 },
    { wch: 22 },  { wch: 12 },  { wch: 18 },  { wch: 14 },
    { wch: 18 },  { wch: 26 },
  ];

  // ── Merge title rows ──
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },  // "CREATORSMELA" spans A-J
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },  // "Moderation Queue Export" spans A-J
    { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } },  // empty spacer row
  ];

  // ── Style: Title row 1 (brand name) ──
  for (let c = 0; c <= 9; c++) {
    const ref = XLSX.utils.encode_cell({ r: 0, c });
    styleCell(ws, ref, {
      font: { bold: true, sz: 16, name: 'Calibri', color: { rgb: BRAND.white } },
      fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
      alignment: { vertical: 'center' },
      border: thinBorder,
    });
  }
  // Override first cell text alignment
  styleCell(ws, 'A1', {
    font: { bold: true, sz: 16, name: 'Calibri', color: { rgb: BRAND.white } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center', horizontal: 'left' },
    border: thinBorder,
  });
  // Override last cell in row 1 (date)
  styleCell(ws, 'J1', {
    font: { sz: 9, name: 'Calibri', italic: true, color: { rgb: 'CBD5E1' } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center', horizontal: 'right' },
    border: thinBorder,
  });

  // ── Style: Title row 2 (subtitle) ──
  for (let c = 0; c <= 9; c++) {
    const ref = XLSX.utils.encode_cell({ r: 1, c });
    styleCell(ws, ref, {
      font: { sz: 11, name: 'Calibri', color: { rgb: '94A3B8' } },
      fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
      alignment: { vertical: 'center' },
      border: thinBorder,
    });
  }
  styleCell(ws, 'A2', {
    font: { sz: 11, name: 'Calibri', color: { rgb: 'CBD5E1' } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center', horizontal: 'left' },
    border: thinBorder,
  });
  styleCell(ws, 'J2', {
    font: { sz: 9, name: 'Calibri', italic: true, color: { rgb: '94A3B8' } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center', horizontal: 'right' },
    border: thinBorder,
  });

  // ── Style: Spacer row (row 3) ──
  for (let c = 0; c <= 9; c++) {
    const ref = XLSX.utils.encode_cell({ r: 2, c });
    styleCell(ws, ref, {
      fill: { fgColor: { rgb: BRAND.white }, patternType: 'solid' },
      border: { top: { style: 'none' }, bottom: { style: 'none' }, left: { style: 'none' }, right: { style: 'none' } },
    });
  }

  // ── Style: Header row (row 4) ──
  for (let c = 0; c <= 9; c++) {
    const ref = XLSX.utils.encode_cell({ r: 3, c });
    styleCell(ws, ref, {
      font: { bold: true, sz: 10, name: 'Calibri', color: { rgb: BRAND.white } },
      fill: { fgColor: { rgb: BRAND.accent }, patternType: 'solid' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: thinBorder,
    });
  }

  // ── Style: Data rows (row 5+) ──
  const dataStartRow = 4;
  for (let r = 0; r < dataRows.length; r++) {
    const excelRow = dataStartRow + r;
    const isEven = r % 2 === 0;
    const bgColor = isEven ? BRAND.rowEven : BRAND.rowOdd;

    for (let c = 0; c <= 9; c++) {
      const ref = XLSX.utils.encode_cell({ r: excelRow, c });
      if (!ws[ref]) continue;

      const baseStyle = {
        font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.text } },
        fill: { fgColor: { rgb: bgColor }, patternType: 'solid' },
        border: thinBorder,
        alignment: { vertical: 'center' },
      };

      // Priority column (col 5) — colored badge
      if (c === 5) {
        const val = String(ws[ref].v).toLowerCase();
        const ps = PRIORITY_STYLES[val];
        if (ps) {
          baseStyle.fill = { fgColor: { rgb: ps.bg }, patternType: 'solid' };
          baseStyle.font = { sz: 10, name: 'Calibri', bold: true, color: { rgb: ps.fg } };
          baseStyle.alignment = { horizontal: 'center', vertical: 'center' };
        }
      }

      // Status column (col 6) — colored badge
      if (c === 6) {
        const val = String(ws[ref].v).toLowerCase().replace(/ /g, '_');
        const ss = STATUS_STYLES[val];
        if (ss) {
          baseStyle.fill = { fgColor: { rgb: ss.bg }, patternType: 'solid' };
          baseStyle.font = { sz: 10, name: 'Calibri', bold: true, color: { rgb: ss.fg } };
          baseStyle.alignment = { horizontal: 'center', vertical: 'center' };
        }
      }

      // Row number (col 0) — muted, centered
      if (c === 0) {
        baseStyle.font = { sz: 10, name: 'Calibri', color: { rgb: BRAND.muted } };
        baseStyle.alignment = { horizontal: 'center', vertical: 'center' };
      }

      // Submission name (col 1) — slightly bolder
      if (c === 1) {
        baseStyle.font = { sz: 10, name: 'Calibri', bold: true, color: { rgb: BRAND.text } };
      }

      // Tags (col 9) — muted, smaller
      if (c === 9) {
        baseStyle.font = { sz: 9, name: 'Calibri', color: { rgb: BRAND.muted } };
        baseStyle.alignment = { vertical: 'center', wrapText: true };
      }

      ws[ref].s = baseStyle;
    }
  }

  // ── Style: Footer row ──
  const footerExcelRow = dataStartRow + dataRows.length;
  for (let c = 0; c <= 9; c++) {
    const ref = XLSX.utils.encode_cell({ r: footerExcelRow, c });
    styleCell(ws, ref, {
      font: { sz: 9, name: 'Calibri', bold: true, color: { rgb: BRAND.muted } },
      fill: { fgColor: { rgb: 'F1F5F9' }, patternType: 'solid' },
      border: { top: { style: 'thin', color: { rgb: BRAND.border } }, bottom: { style: 'none' }, left: { style: 'none' }, right: { style: 'none' } },
      alignment: { vertical: 'center' },
    });
  }
  styleCell(ws, XLSX.utils.encode_cell({ r: footerExcelRow, c: 9 }), {
    font: { sz: 9, name: 'Calibri', bold: true, color: { rgb: BRAND.muted } },
    fill: { fgColor: { rgb: 'F1F5F9' }, patternType: 'solid' },
    border: { top: { style: 'thin', color: { rgb: BRAND.border } }, bottom: { style: 'none' }, left: { style: 'none' }, right: { style: 'none' } },
    alignment: { vertical: 'center', horizontal: 'right' },
  });

  // ──────────────────────────────────────────────
  //  SHEET 2: Summary
  // ──────────────────────────────────────────────
  const statusCounts = Object.entries(STATUS_STYLES).map(([key, style]) => ({
    key,
    label: style.label,
    count: data.filter((r) => r.status === key).length,
    bg: style.bg,
    fg: style.fg,
  }));

  const priorityCounts = Object.entries(PRIORITY_STYLES).map(([key, style]) => ({
    key,
    label: style.label,
    count: data.filter((r) => r.priority === key).length,
    bg: style.bg,
    fg: style.fg,
  }));

  const summaryData = [
    ['CREATORSMELA', '', ''],
    ['Export Summary', '', ''],
    ['', '', ''],
    ['Report', 'Moderation Queue', ''],
    ['Generated', generatedAt, ''],
    ['Total Records', data.length, ''],
    ['', '', ''],
    ['STATUS BREAKDOWN', 'Count', '%'],
    ...statusCounts.map((s) => [
      s.label,
      s.count,
      data.length > 0 ? `${((s.count / data.length) * 100).toFixed(1)}%` : '0%',
    ]),
    ['', '', ''],
    ['PRIORITY BREAKDOWN', 'Count', '%'],
    ...priorityCounts.map((p) => [
      p.label,
      p.count,
      data.length > 0 ? `${((p.count / data.length) * 100).toFixed(1)}%` : '0%',
    ]),
  ];

  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 24 }, { wch: 18 }, { wch: 10 }];

  // Merge title rows
  summaryWs['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
  ];

  // Style summary title
  styleCell(summaryWs, 'A1', {
    font: { bold: true, sz: 16, name: 'Calibri', color: { rgb: BRAND.white } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center' },
    border: thinBorder,
  });
  for (let c = 1; c <= 2; c++) {
    styleCell(summaryWs, XLSX.utils.encode_cell({ r: 0, c }), {
      font: { sz: 16, name: 'Calibri', color: { rgb: BRAND.white } },
      fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
      border: thinBorder,
    });
  }

  styleCell(summaryWs, 'A2', {
    font: { sz: 11, name: 'Calibri', color: { rgb: 'CBD5E1' } },
    fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
    alignment: { vertical: 'center' },
    border: thinBorder,
  });
  for (let c = 1; c <= 2; c++) {
    styleCell(summaryWs, XLSX.utils.encode_cell({ r: 1, c }), {
      fill: { fgColor: { rgb: BRAND.primary }, patternType: 'solid' },
      border: thinBorder,
    });
  }

  // Style info rows (4-5)
  for (let r = 4; r <= 5; r++) {
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 0 }), {
      font: { bold: true, sz: 10, name: 'Calibri', color: { rgb: BRAND.muted } },
      alignment: { vertical: 'center' },
    });
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 1 }), {
      font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.text } },
      alignment: { vertical: 'center' },
    });
  }

  // Style section headers
  const statusHeaderRow = 7;
  const priorityHeaderRow = 7 + statusCounts.length + 2;

  for (const hr of [statusHeaderRow, priorityHeaderRow]) {
    for (let c = 0; c <= 2; c++) {
      const ref = XLSX.utils.encode_cell({ r: hr, c });
      styleCell(summaryWs, ref, {
        font: { bold: true, sz: 10, name: 'Calibri', color: { rgb: BRAND.white } },
        fill: { fgColor: { rgb: BRAND.accent }, patternType: 'solid' },
        alignment: { horizontal: c === 0 ? 'left' : 'center', vertical: 'center' },
        border: thinBorder,
      });
    }
  }

  // Style status data rows
  statusCounts.forEach((s, i) => {
    const r = statusHeaderRow + 1 + i;
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 0 }), {
      font: { sz: 10, name: 'Calibri', bold: true, color: { rgb: s.fg } },
      fill: { fgColor: { rgb: s.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { vertical: 'center' },
    });
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 1 }), {
      font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.text } },
      fill: { fgColor: { rgb: s.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { horizontal: 'center', vertical: 'center' },
    });
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 2 }), {
      font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.muted } },
      fill: { fgColor: { rgb: s.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { horizontal: 'center', vertical: 'center' },
    });
  });

  // Style priority data rows
  priorityCounts.forEach((p, i) => {
    const r = priorityHeaderRow + 1 + i;
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 0 }), {
      font: { sz: 10, name: 'Calibri', bold: true, color: { rgb: p.fg } },
      fill: { fgColor: { rgb: p.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { vertical: 'center' },
    });
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 1 }), {
      font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.text } },
      fill: { fgColor: { rgb: p.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { horizontal: 'center', vertical: 'center' },
    });
    styleCell(summaryWs, XLSX.utils.encode_cell({ r, c: 2 }), {
      font: { sz: 10, name: 'Calibri', color: { rgb: BRAND.muted } },
      fill: { fgColor: { rgb: p.bg }, patternType: 'solid' },
      border: thinBorder,
      alignment: { horizontal: 'center', vertical: 'center' },
    });
  });

  // ── Build workbook ──
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Moderation Queue');
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  XLSX.writeFile(wb, `${filename}-${timestamp}.xlsx`, { bookType: 'xlsx' });
}
