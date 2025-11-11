import { Contact } from "@/screens/contact";
import { getMetaData } from "app/(main)/layout";

export const metadata = getMetaData({
  name: "Contact",
  description: "Contact page platformz",
});

export default function Page() {
  return (
    <main className="page">
      <Contact />
    </main>
  );
}
