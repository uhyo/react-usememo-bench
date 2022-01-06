import "./App.css";
import { useBench } from "./bench/useBench";
import { useControls } from "./controls/useControls";

function App() {
  const { controls, renderNinput, renderTimingSelect } = useControls();
  const { renderBenchArea, renderBenchStatus, startBench } = useBench(
    controls,
    (data) => {
      console.log({ data });
    }
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>React useMemo Benchmark</h1>
      </header>
      <section>
        <h2>Settings</h2>
        <p>{renderTimingSelect()}</p>
        <p>{renderNinput()}</p>
      </section>
      <p>
        <button className="App-run-button" onClick={startBench}>
          Run
        </button>
      </p>
      <hr />
      {renderBenchStatus()}
      {renderBenchArea()}
    </div>
  );
}

export default App;
