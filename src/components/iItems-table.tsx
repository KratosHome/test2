"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  SortDescriptor,
} from "@heroui/table";
import { Pagination, Button } from "@heroui/react";
import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { DateUtil } from "@/utils/data";

type Props = {
  items?: ITableItem[];
};

const rowsPerPage = 25;

function getSortValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const date = Date.parse(value);

    return !isNaN(date) ? date : value.toLowerCase();
  }

  return 0;
}

const ItemsTable = ({ items = [] }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "make",
    direction: "ascending",
  });

  const filterMake = searchParams.get("make");
  const filterModel = searchParams.get("model");
  const filterYearFrom = Number(searchParams.get("yearFrom"));
  const filterYearTo = Number(searchParams.get("yearTo"));
  const filterMileageFrom = Number(searchParams.get("mileageFrom"));
  const filterMileageTo = Number(searchParams.get("mileageTo"));
  const page = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) params.delete("page");
    else params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const filteredItems = items.filter((item) => {
    const matchMake = !filterMake || item.make === filterMake;
    const matchModel = !filterModel || item.model === filterModel;
    const matchYearFrom =
      !filterYearFrom || Number(item.year) >= filterYearFrom;
    const matchYearTo = !filterYearTo || Number(item.year) <= filterYearTo;
    const matchMileageFrom =
      !filterMileageFrom || item.mileage >= filterMileageFrom;
    const matchMileageTo = !filterMileageTo || item.mileage <= filterMileageTo;

    return (
      matchMake &&
      matchModel &&
      matchYearFrom &&
      matchYearTo &&
      matchMileageFrom &&
      matchMileageTo
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = getSortValue(a[sortDescriptor.column as keyof ITableItem]);
    const bVal = getSortValue(b[sortDescriptor.column as keyof ITableItem]);
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));

    return sortDescriptor.direction === "ascending" ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
  const paginatedItems = sortedItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  if (filteredItems.length === 0) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-gray-500">
          No items found with current filters.
        </p>
        <Button onPress={handleResetFilters}>Reset Filters</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table
        bottomContent={
          totalPages > 1 && (
            <div className="flex w-full justify-center bg-content1 px-6 py-4 border-t border-default-200">
              <Pagination
                disableCursorAnimation
                isCompact
                showControls
                page={page}
                total={totalPages}
                onChange={handlePageChange}
              />
            </div>
          )
        }
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn key="make" allowsSorting>
            Make
          </TableColumn>
          <TableColumn key="model" allowsSorting>
            Model
          </TableColumn>
          <TableColumn key="mileage" allowsSorting>
            Mileage
          </TableColumn>
          <TableColumn key="year" allowsSorting>
            Year
          </TableColumn>
          <TableColumn key="updated_at" allowsSorting>
            Last Update
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display" items={paginatedItems}>
          {(item) => (
            <TableRow
              key={item.unique_id}
              className="hover:bg-content3 cursor-pointer border-b"
            >
              <TableCell className="px-4 py-2">{item.make}</TableCell>
              <TableCell className="px-4 py-2">{item.model}</TableCell>
              <TableCell className="px-4 py-2 text-right">
                {item.mileage}
              </TableCell>
              <TableCell className="px-4 py-2 text-right">
                {item.year}
              </TableCell>
              <TableCell className="px-4 py-2">
                {DateUtil(item.updated_at).format("MM/DD/YYYY HH:mm")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ItemsTable;
