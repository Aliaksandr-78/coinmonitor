import { ReactNode, useState } from 'react'

interface TableProps {
  headers: string[]
  children: ReactNode
  className?: string
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void
}

const Table: React.FC<TableProps> = ({ headers, children, className = '', onSort }) => {
  const [sortConfig, setSortConfig] = useState<{ column: number; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (index: number) => {
    if (!onSort) return

    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.column === index && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ column: index, direction })
    onSort(index, direction)
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-300" role="table">
        <thead className="bg-gray-700 text-white">
          <tr role="row">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left text-sm font-semibold tracking-wider cursor-pointer select-none"
                onClick={() => handleSort(index)}
                aria-sort={
                  sortConfig?.column === index ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'
                }
                role="columnheader"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-50 divide-y divide-gray-200" role="rowgroup">
          {children}
        </tbody>
      </table>
    </div>
  )
}

export default Table
