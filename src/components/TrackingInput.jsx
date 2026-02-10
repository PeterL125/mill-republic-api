import React from 'react';

const TrackingInput = ({ onSearch, isLoading }) => {
  const [trackingId, setTrackingId] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      onSearch(trackingId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center border-b border-blue-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="输入追踪单号"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? '查询中...' : '查询'}
        </button>
      </div>
    </form>
  );
};

export default TrackingInput;
