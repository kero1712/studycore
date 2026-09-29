import SearchClient from "@/components/SearchClient";
import { getSearchIndex } from "@/lib/data";

export default async function SearchPage() {
  return <SearchClient index={await getSearchIndex()} />;
}
