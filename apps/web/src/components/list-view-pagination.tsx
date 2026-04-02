"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Dispatch, SetStateAction } from "react"

// Generic type for data items
export interface DataItem {
  id?: string
  [key: string]: unknown
}

export interface Column<T = DataItem> {
  key: string
  header: string
  render?: (value: unknown, item: T) => React.ReactNode
}

export interface Action<T = DataItem> {
  icon: React.ReactNode
  label: string
  onClick: (item: T) => void
  variant?: "ghost" | "destructive" | "outline"
  showForRoles?: string[]
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BulkAction<T = DataItem> {
  icon: React.ReactNode
  label: string
  onClick: (items: T[]) => void
  variant?: "ghost" | "destructive" | "outline"
  showForRoles?: string[]
}

interface ListViewPaginationProps<T = DataItem> {
  title: string
  description: string
  columns: Column<T>[]
  data: T[]
  pagination: PaginationInfo
  loading?: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  onPageChange: (page: number) => void
  selectedItems?: Set<string>
  setSelectedItems?: Dispatch<SetStateAction<Set<string>>>
  actions?: Action<T>[]
  bulkActions?: BulkAction<T>[]
  searchPlaceholder?: string
  emptyMessage?: string
  enableBulkSelect?: boolean
}

export function ListViewPagination<T extends DataItem = DataItem>({
  title,
  description,
  columns,
  data,
  pagination,
  loading = false,
  searchTerm,
  onSearchChange,
  onPageChange,
  selectedItems,
  setSelectedItems,
  actions = [],
  bulkActions = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  enableBulkSelect = false
}: ListViewPaginationProps<T>) {
  const { user } = useAuth()

  if (enableBulkSelect && (!selectedItems || !setSelectedItems)) {
    throw new Error("Bulk select enabled but no selectedItems/setSelectedItems provided")
  }

  const renderCellValue = (column: Column<T>, item: T): React.ReactNode => {
    const value = item[column.key as keyof T]

    if (column.render) return column.render(value, item)

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>
    }

    if (typeof value === "boolean") {
      return (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Yes" : "No"}
        </Badge>
      )
    }

    // stricter date check
    const isIsoDateString = (val: string) =>
      /^\d{4}[-/]\d{2}[-/]\d{2}(T.*)?$/.test(val)

    if (
      value instanceof Date ||
      (typeof value === "string" && isIsoDateString(value))
    ) {
      return new Date(value as string | Date).toLocaleDateString()
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "bigint"
    ) {
      return String(value)
    }

    return value ? String(value) : <span className="text-gray-400">-</span>
  }

  const filteredActions = actions.filter(
    action => !action.showForRoles || action.showForRoles.includes(user?.role || "")
  )

  const filteredBulkActions = bulkActions.filter(
    action => !action.showForRoles || action.showForRoles.includes(user?.role || "")
  )

  const handleSelectAll = (checked: boolean) => {
    if (!setSelectedItems) return
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        data.forEach(item => {
          if (item.id) newSet.add(item.id);
        });
      } else {
        data.forEach(item => {
          if (item.id) newSet.delete(item.id);
        });
      }
      return newSet;
    })

  }

  const handleSelectItem = (item: T, checked: boolean) => {
    if (!setSelectedItems || !selectedItems || !item.id) return

    setSelectedItems(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(item.id!)
      } else {
        next.delete(item.id!);
      }
      return next
    })
  }

  const getSelectedItemsData = (): T[] => {
    if (!selectedItems) return []
    return data.filter(item => item.id && selectedItems.has(item.id));
  }

  const handleBulkAction = (action: BulkAction<T>) => {
    if (!setSelectedItems || !selectedItems) return
    const selectedData = getSelectedItemsData()
    if (selectedData.length > 0) {
      action.onClick(selectedData)
      setSelectedItems(() => new Set())
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {enableBulkSelect && selectedItems && selectedItems.size > 0 && (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedItems.size} selected
                </span>
                {filteredBulkActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => handleBulkAction(action)}
                    title={action.label}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            {emptyMessage}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {enableBulkSelect && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={data.length > 0 && data.every(item => item.id && selectedItems?.has(item.id))}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        aria-label="Select all items"
                      />
                    </TableHead>
                  )}
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.header}</TableHead>
                  ))}
                  {filteredActions.length > 0 && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => {
                  const itemId = item.id ?? index
                  const isSelected = item.id ? selectedItems?.has(item.id) : false

                  return (
                    <TableRow key={itemId}>
                      {enableBulkSelect && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (item.id && typeof checked === "boolean") {
                                handleSelectItem(item, checked)
                              }
                            }}
                            aria-label={`Select item ${itemId}`}
                            disabled={!item.id}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={column.key === columns[0].key ? "font-medium" : ""}
                        >
                          {renderCellValue(column, item)}
                        </TableCell>
                      ))}
                      {filteredActions.length > 0 && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {filteredActions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                variant={action.variant || "ghost"}
                                size="sm"
                                onClick={() => action.onClick(item)}
                                title={action.label}
                              >
                                {action.icon}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} items
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
