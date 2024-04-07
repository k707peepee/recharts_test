import Image from "next/image";
import LabelLineChart from "./components/LabelLineChart";
import CardPage from "./components/card";
import LuckBarChart from "./components/LuckBarChart";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CardPage />
      </div>
      <div className="mt-10">
        <LabelLineChart />
      </div>
      <div className="mt-10">
        <LuckBarChart />
      </div>
    </main>
  );
}
