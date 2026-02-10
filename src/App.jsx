import { useState } from "react";
import TrackingInput from "./components/TrackingInput";
import TrackingResult from "./components/TrackingResult";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return {
      date: d.toLocaleDateString("zh-CN", { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: d.toLocaleTimeString("zh-CN", { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      }),
    };
  };

  const convertToTrackingData = (item, inputId) => {
    const fields = item.fields;

    // 提取追踪ID - 从数组中的text字段获取
    const trackingId = fields["Track ID"]?.[0]?.text || inputId;
    
    // 提取批次号
    const batchId = fields["Batch ID"] || "未指定";
    
    // 提取农场位置 - 从数组中获取text
    const origin = fields["Farm Location"]?.[0]?.text || "农场位置信息缺失";
    
    // 提取仓库位置 - 这是一个对象，取name字段
    const destination = fields["Warehouse Location"]?.name || "仓库位置信息缺失";

    // 提取送达时间并格式化
    const deliveryTs = fields["Delivery Date"];
    const estimatedDelivery = deliveryTs
      ? new Date(deliveryTs).toLocaleDateString("zh-CN", { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : "待定";

    // 构建物流事件时间线（基于可用的时间戳字段）
    const eventDefs = [
      { 
        key: "Pickup From Farm On", 
        location: origin, 
        description: "从农场取货" 
      },
      { 
        key: "Process Date at MR Hub", 
        location: "MR处理中心", 
        description: "在MR中心处理" 
      },
      { 
        key: "Pickup Date at MR Hub", 
        location: "MR处理中心", 
        description: "从MR中心发出" 
      },
      { 
        key: "Arrival at Warehouse", 
        location: destination, 
        description: "抵达仓库" 
      },
      { 
        key: "Delivery Date", 
        location: destination, 
        description: "已送达" 
      },
    ];

    // 筛选出有时间的物流事件并格式化
    const events = eventDefs
      .filter((def) => fields[def.key])
      .map((def) => {
        const timestamp = fields[def.key];
        const { date, time } = formatTimestamp(timestamp);
        return { 
          date, 
          time, 
          location: def.location, 
          description: def.description 
        };
      })
      .reverse(); // 最新的事件在前

    // 判断当前物流状态
    let status = "in_transit";
    let statusText = "运输中";
    
    if (fields["Delivery Date"] && new Date(fields["Delivery Date"]) <= new Date()) {
      status = "delivered";
      statusText = "已送达";
    } else if (fields["Arrival at Warehouse"]) {
      status = "arrived";
      statusText = "已抵达仓库";
    } else if (fields["Pickup From Farm On"]) {
      status = "picked_up";
      statusText = "已取货";
    } else {
      status = "pending";
      statusText = "待处理";
    }

    // 最后更新时间
    const lastUpdate = events.length > 0 
      ? `${events[0].date} ${events[0].time}`
      : "暂无更新";

    return { 
      trackingId, 
      batchId,
      status, 
      statusText, 
      origin, 
      destination, 
      estimatedDelivery, 
      lastUpdate, 
      events 
    };
  };

  const handleSearch = async (trackingId) => {
    setIsLoading(true);
    setError(null);
    setTrackingData(null);

    try {
      const res = await fetch("https://mill-republic-api.vercel.app/api/fetchTable");
      if (!res.ok) throw new Error("API请求失败");

      const result = await res.json();
      
      // 调整数据结构：你的数据在 result.data.items 中
      if (!result.success || !result.data?.items) {
        throw new Error("API返回的数据结构无效");
      }

      const records = result.data.items;
      const matched = records.find(
        (item) => item.fields?.["Track ID"]?.[0]?.text === trackingId
      );

      if (!matched) {
        setError("未找到匹配的记录。请检查追踪单号后重试。");
        return;
      }

      setTrackingData(convertToTrackingData(matched, trackingId));
    } catch (err) {
      setError("无法获取追踪信息，请稍后再试。");
      console.error("查询错误:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 relative">
      {/* Logo图片 - 直接使用public目录路径 */}
      <img src="/logo.png" alt="Mill Republic" className="absolute top-10 left-6 h-[5rem]" />
      <TrackingInput onSearch={handleSearch} isLoading={isLoading} />

      <div className="w-full max-w-2xl mt-8">
        <TrackingResult data={trackingData} error={error} />
      </div>
    </div>
  );
};

export default App;
