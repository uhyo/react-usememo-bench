import { useMemo, useState } from "react";
import { BenchDataSet, BenchMode } from "../bench/useBench";

const percentiles = [25, 50, 75, 99];

type StatsData = {
  mode: BenchMode;
  min: number;
  max: number;
  percentiles: {
    at: number;
    value: number;
  }[];
};

export function useVisualizer() {
  const [rawData, setData] = useState<BenchDataSet | undefined>(undefined);

  const stats = useMemo(() => {
    return rawData?.map(({ mode, times }): StatsData => {
      const sortedTimes = [...times].sort((a, b) => a - b);
      const percentileIndices = percentiles.map((percentile) =>
        Math.floor((percentile / 100) * times.length)
      );
      const min = sortedTimes[0] || 0;
      const max = sortedTimes[times.length - 1] || 0;
      return {
        mode,
        min,
        max,
        percentiles: percentiles.map((percentile, index) => ({
          at: percentile,
          value: sortedTimes[percentileIndices[index] || 0] || 0,
        })),
      };
    });
  }, [rawData]);

  const renderStats = () => {
    if (!stats) {
      return null;
    }
    return (
      <table>
        <thead>
          <tr>
            <td />
            <th>min (ms)</th>
            {percentiles.map((at) => (
              <th key={at}>{at}% (ms)</th>
            ))}
            <th>max (ms)</th>
          </tr>
        </thead>
        <tbody>
          {stats?.map(({ mode, min, max, percentiles }) => {
            return (
              <tr key={mode}>
                <th>{mode}</th>
                <td>{min.toFixed(2)}</td>
                {percentiles.map(({ at, value }) => (
                  <td key={at}>{value.toFixed(2)}</td>
                ))}
                <td>{max.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return {
    setData,
    renderStats,
  };
}
