import { useState } from "react";
// 注意：这里不再导入图片，而是直接使用路径
import TrackingInput from "./components/TrackingInput";
import TrackingResult from "./components/TrackingResult";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  const convertToTrackingData = (item, inputId) => {
    const fields = item.fields;

    const trackingId = fields["Track ID"]?.[0]?.text || inputId;
    const origin = fields["Farm Location"]?.[0]?.text || "Origin N/A";
    const destination = fields["Warehouse Location"]?.name || "Destination N/A";

    const deliveryTs = fields["Delivery Date"];
    const estimatedDelivery = deliveryTs
      ? new Date(deliveryTs).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "TBD";

    const eventDefs = [
      { key: "Pickup From Farm On", location: origin, description: "Picked up from farm" },
      { key: "Process Date at MR Hub", location: "MR Hub", description: "Processing at MR Hub" },
      { key: "Pickup Date at MR Hub", location: "MR Hub", description: "Dispatched from MR Hub" },
      { key: "Delivery Date", location: destination, description: "Delivered" },
    ];

    const events = eventDefs
      .filter((def) => fields[def.key])
      .map((def) => {
        const { date, time } = formatTimestamp(fields[def.key]);
        return { date, time, location: def.location, description: def.description };
      })
      .reverse();

    let status = "in_transit";
    let statusText = "In Transit";
    if (fields["Delivery Date"] && new Date(fields["Delivery Date"]) <= new Date()) {
      status = "delivered";
      statusText = "Delivered";
    } else if (!fields["Pickup From Farm On"]) {
      status = "pending";
      statusText = "Pending";
    }

    const lastUpdate = events.length > 0 ? `${events[0].date} ${events[0].time}` : "N/A";

    return { trackingId, status, statusText, origin, destination, estimatedDelivery, lastUpdate, events };
  };

  const handleSearch = async (trackingId) => {
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await fetch("https://mill-republic-api.vercel.app/api/fetchTable");
      if (!res.ok) throw new Error("API request failed");

      const records = await res.json();
      const matched = records.find(
        (item) => item.fields?.["Track ID"]?.[0]?.text === trackingId
      );

      if (!matched) {
        setError("No matching record found. Please check your tracking ID and try again.");
        return;
      }

      setTrackingData(convertToTrackingData(matched, trackingId));
    } catch (err) {
      setError("Unable to fetch tracking information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 relative">
      {/* 关键修改：直接使用 /logo.png 路径，不通过导入 */}
      <img src="/logo.png" alt="Mill Republic" className="absolute top-10 left-6 h-[5rem]" />
      <TrackingInput onSearch={handleSearch} isLoading={isLoading} />

      <div className="w-full max-w-2xl mt-8">
        <TrackingResult data={trackingData} error={error} />
      </div>
    </div>
  );
};

export default App;
