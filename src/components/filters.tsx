"use client";
import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input, Select, SelectItem } from "@heroui/react";

type Props = {
  items?: ITableItem[];
};

const Filters = ({ items = [] }: Props) => {
  const uniqueMakes = Array.from(new Set(items.map((i) => i.make)));
  const uniqueModels = Array.from(new Set(items.map((i) => i.model)));
  const allYears = Array.from(new Set(items.map((i) => Number(i.year)))).sort(
    (a, b) => a - b,
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateParam = (key: string, value?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      <Select
        className="w-full"
        label="Make"
        selectedKeys={[searchParams.get("make") || ""]}
        onSelectionChange={(keys) => updateParam("make", Array.from(keys)[0])}
      >
        {uniqueMakes.map((make) => (
          <SelectItem key={make}>{make}</SelectItem>
        ))}
      </Select>

      <Select
        className="w-full"
        label="Model"
        selectedKeys={[searchParams.get("model") || ""]}
        onSelectionChange={(keys) => updateParam("model", Array.from(keys)[0])}
      >
        {uniqueModels.map((model) => (
          <SelectItem key={model}>{model}</SelectItem>
        ))}
      </Select>

      <Select
        className="w-full"
        label="Year From"
        selectedKeys={[searchParams.get("yearFrom") || ""]}
        onSelectionChange={(keys) =>
          updateParam("yearFrom", Array.from(keys)[0])
        }
      >
        {allYears.map((year) => (
          <SelectItem key={year}>{year.toString()}</SelectItem>
        ))}
      </Select>

      <Select
        className="w-full"
        label="Year To"
        selectedKeys={[searchParams.get("yearTo") || ""]}
        onSelectionChange={(keys) => updateParam("yearTo", Array.from(keys)[0])}
      >
        {allYears.map((year) => (
          <SelectItem key={year}>{year.toString()}</SelectItem>
        ))}
      </Select>

      <Input
        className="border p-2 w-full"
        defaultValue={searchParams.get("mileageFrom") || ""}
        placeholder="Mileage From"
        type="number"
        onChange={(e) => updateParam("mileageFrom", e.target.value)}
      />

      <Input
        className="border p-2 w-full"
        defaultValue={searchParams.get("mileageTo") || ""}
        placeholder="Mileage To"
        type="number"
        onChange={(e) => updateParam("mileageTo", e.target.value)}
      />
    </div>
  );
};

export default Filters;
