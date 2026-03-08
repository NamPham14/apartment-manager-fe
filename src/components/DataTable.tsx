/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
  }[];
  onSort?: (key: keyof T) => void;
  onDelete?: (item: T) => void;
  onEdit?: (item: T) => void;
}

export const DataTable = <T extends { id: any }>({ 
  data, 
  columns,
  onSort, 
  onDelete,
  onEdit
}: DataTableProps<T>) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#2d2d2d] bg-[#1a1a1a]/50">
              {columns.map((col, idx) => (
                <th 
                  key={`${String(col.key)}-${idx}`}
                  onClick={() => col.sortable && onSort?.(col.key)}
                  className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    {col.label} {col.sortable && <i className="lucide lucide-arrow-up-down text-[10px]"></i>}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d2d]">
            {data.map((item, rowIdx) => (
              <tr key={`${item.id}-${rowIdx}`} className="hover:bg-[#FF9500]/5 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={`cell-${rowIdx}-${colIdx}-${String(col.key)}`} className="px-6 py-4">
                    {col.render ? col.render(item) : (
                      <span className="text-sm text-gray-300">{(item as any)[col.key]}</span>
                    )}
                  </td>
                ))}
                <td key={`actions-${rowIdx}`} className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit?.(item)}
                      className="p-2 rounded-lg hover:bg-[#1a1a1a] text-gray-400 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete?.(item)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
