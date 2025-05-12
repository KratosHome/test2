import vehicles from "@/mock/mock_vehicles.json";
import ItemsTable from "@/components/iItems-table";
import Filters from "@/components/filters";

export default async function Page() {
  return (
    <>
      <Filters items={vehicles} />
      <ItemsTable items={vehicles} />
    </>
  );
}
