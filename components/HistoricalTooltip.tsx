"use client";

import React from "react";
import { AddressData } from "@/stores/addresses";
import { createScoreTooltipContent, createPositionTooltipContent } from "@/lib/historicalData";

interface HistoricalTooltipProps {
  item: AddressData;
  type: "score" | "position" | "percentage";
  children: React.ReactNode;
}

const HistoricalTooltip: React.FC<HistoricalTooltipProps> = ({ item, type, children }) => {
  if (!item.yesterday_data) {
    return <>{children}</>;
  }

  let tooltipContent: React.ReactNode;

  if (type === "score") {
    const content = createScoreTooltipContent(item);
    if (!content) return <>{children}</>;

    tooltipContent = (
      <>
        <div>Current: {content.current}</div>
        <div>Yesterday: {content.yesterday}</div>
        <div>Change: {content.change}</div>
        <div>Change %: {content.changePercent}</div>
      </>
    );
  } else if (type === "position") {
    const content = createPositionTooltipContent(item);
    if (!content) return <>{children}</>;

    tooltipContent = (
      <>
        <div>Current: {content.current}</div>
        <div>Yesterday: {content.yesterday}</div>
        <div>Change: {content.change > 0 ? `+${content.change}` : content.change}</div>
      </>
    );
  } else {
    // Percentage tooltip
    const current = item.data?.percentage || 0;
    const yesterday = item.yesterday_data.data?.percentage || 
                     item.yesterday_data.percentage || 0;
    const change = current - yesterday;
    
    tooltipContent = (
      <>
        <div>Current: {current.toFixed(2)}%</div>
        <div>Yesterday: {yesterday.toFixed(2)}%</div>
        <div>Change: {change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2)}%</div>
      </>
    );
  }

  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute z-10 invisible group-hover:visible bg-black/90 text-white p-2 rounded text-sm min-w-[180px] -translate-y-full -translate-x-1/2 left-1/2 top-0 mt-[-10px] shadow-lg">
        <div className="flex flex-col gap-1">
          {tooltipContent}
        </div>
        <div className="absolute w-3 h-3 bg-black/90 transform rotate-45 left-1/2 -ml-1.5 -bottom-1.5"></div>
      </div>
    </div>
  );
};

export default HistoricalTooltip; 