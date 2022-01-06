import { useState } from "react";

type RenderTiming = "first" | "second";

export type Controls = {
  M: number;
  N: number;
  renderTiming: RenderTiming;
};

export const useControls = () => {
  const [renderTiming, setRenderTiming] = useState<RenderTiming>("first");
  const [Mstring, setM] = useState("1000");
  const [Nstring, setN] = useState("1000");

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

  const renderMinput = () => {
    return (
      <label>
        Number of useMemo/div per rendering
        <input
          type="number"
          value={Mstring}
          onChange={(e) => setM(e.target.value)}
        />
      </label>
    );
  };

  const renderNinput = () => {
    return (
      <label>
        Number of renderings
        <input
          type="number"
          value={Nstring}
          onChange={(e) => setN(e.target.value)}
        />
      </label>
    );
  };

  const controls: Controls = {
    M: Number(Mstring) || 1000,
    N: Number(Nstring) || 1000,
    renderTiming,
  };

  return {
    controls,
    renderTimingSelect,
    renderMinput,
    renderNinput,
  };
};
