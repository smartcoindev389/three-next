import { Page404 } from "@/screens/404";
import { getMetaData } from "app/(main)/layout";

export const metadata = getMetaData({
  name: "404",
  description: "404 page platformz",
});

export default function Page() {
  return (
    <main className="page">
      <Page404 />
    </main>
  );
}
