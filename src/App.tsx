import "./App.css";
import { useBench } from "./bench/useBench";
import { useControls } from "./controls/useControls";
import { useVisualizer } from "./visualizer/useVisualizer";

function App() {
  const { controls, renderMinput, renderNinput, renderTimingSelect } =
    useControls();
  const { setData, renderStats } = useVisualizer();
  const { renderBenchArea, renderBenchStatus, startBench } = useBench(
    controls,
    setData
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>React useMemo Benchmark</h1>
      </header>
      <section>
        <h2>Settings</h2>
        <p>{renderTimingSelect()}</p>
        <p>{renderMinput()}</p>
        <p>{renderNinput()}</p>
      </section>
      <p>
        <button className="App-run-button" onClick={startBench}>
          Run
        </button>
      </p>
      <hr />
      <p>{renderBenchStatus()}</p>
      <hr />
      {renderStats()}
      {renderBenchArea()}
    </div>
  );
}

export default App;
