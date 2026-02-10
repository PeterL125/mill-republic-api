import React from 'react';

const TrackingResult = ({ data, error }) => {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">追踪信息</h2>
      <div className="mb-4">
        <p><span className="font-semibold">追踪单号：</span>{data.trackingId}</p>
        <p className={`font-semibold inline-block px-2 py-1 rounded text-sm ${
          data.status === 'delivered' ? 'bg-green-100 text-green-800' :
          data.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          状态：{data.statusText}
        </p>
        <p><span className="font-semibold">始发地：</span>{data.origin}</p>
        <p><span className="font-semibold">目的地：</span>{data.destination}</p>
        <p><span className="font-semibold">预计送达：</span>{data.estimatedDelivery}</p>
        <p><span className="font-semibold">最后更新：</span>{data.lastUpdate}</p>
      </div>
      
      {data.events && data.events.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-2">物流轨迹</h3>
          <div className="space-y-3">
            {data.events.map((event, index) => (
              <div key={index} className="flex items-start border-l-4 border-blue-500 pl-4 py-1">
                <div className="flex-1">
                  <div className="font-medium">{event.location}</div>
                  <div className="text-gray-600 text-sm">{event.description}</div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{event.date}</div>
                  <div>{event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingResult;
