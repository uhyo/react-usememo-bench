import { useState } from "react";

type RenderTiming = "first" | "second";

export type Controls = {
  N: number;
  renderTiming: RenderTiming;
};

export const useControls = () => {
  const [renderTiming, setRenderTiming] = useState<RenderTiming>("first");
  const [Nstring, setN] = useState("10");

  const toggleRenderTiming = () => {
    setRenderTiming((timing) => {
      if (timing === "first") {
        return "second";
      } else {
        return "first";
      }
    });
  };

  const renderTimingSelect = () => {
    return (
      <label>
        Render timing
        <select
          value={renderTiming}
          onChange={(e) => setRenderTiming(e.target.value as RenderTiming)}
        >
          <option value="first">初回</option>
          <option value="second">再レンダリング</option>
        </select>
      </label>
    );
  };

  const renderNinput = () => {
    return (
      <label>
        N
        <input
          type="number"
          value={Nstring}
          onChange={(e) => setN(e.target.value)}
        />
      </label>
    );
  };

  const controls: Controls = {
    N: Number(Nstring) || 1000,
    renderTiming,
  };

  return {
    controls,
    renderTimingSelect,
    renderNinput,
  };
};
