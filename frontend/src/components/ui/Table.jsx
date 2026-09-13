import React from 'react';

export default function Table({ columns = [], data = [], onRowClick, emptyMessage = 'No data found.' }) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#1E1E28]">
            {columns.map(col => (
              <th key={col.key} className="text-left py-3 px-4 text-[10px] font-semibold text-[#555570] uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#141418]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-sm text-[#555570]">
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors duration-100 ${onRowClick ? 'cursor-pointer hover:bg-white/[0.025]' : ''}`}
            >
              {columns.map(col => (
                <td key={col.key} className="py-3.5 px-4 text-sm text-[#ccccdd]">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
