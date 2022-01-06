import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controls } from "../controls/useControls";

const benchModes = ["raw", "useMemo", "div"] as const;

export type BenchMode = typeof benchModes[number];
export type BenchStatus = "idle" | "warmup" | "running" | "done";

export type BenchDataSet = {
  mode: BenchMode;
  times: number[];
}[];

type BenchProcess = {
  status: BenchStatus;
  mode: BenchMode;
};

export function useBench(
  controls: Controls,
  onResult: (data: BenchDataSet) => void
) {
  const [{ status, mode }, setBenchMode] = useState<BenchProcess>({
    status: "idle",
    mode: "raw",
  });

  const Bench = useMemo(
    () => createBenchComponent(controls, mode),
    [controls, mode]
  );

  const dataRef = useRef<BenchDataSet>([]);
  const { current: benchTimes } = useRef<number[]>([]);

  const reportTime = useCallback(
    (time: number) => {
      benchTimes.push(time);
      if (benchTimes.length === controls.N) {
        if (status === "running") {
          dataRef.current.push({
            mode,
            times: [...benchTimes],
          });
        }
        benchTimes.length = 0;

        setBenchMode(({ mode, status }) => {
          switch (status) {
            case "idle":
            case "done":
              return { mode, status };
            case "warmup":
              return { mode, status: "running" };
            case "running": {
              const currentBenchIndex = benchModes.indexOf(mode);
              const next = benchModes[currentBenchIndex + 1];
              if (next === undefined) {
                // the end
                return {
                  mode: benchModes[0],
                  status: "done",
                };
              } else {
                return {
                  mode: next,
                  status: "warmup",
                };
              }
            }
          }
        });
      }
    },
    [mode, status, onResult]
  );

  const startBench = useCallback(() => {
    dataRef.current = [];
    benchTimes.length = 0;
    setBenchMode({
      mode: benchModes[0],
      status: "warmup",
    });
  }, []);

  useEffect(() => {
    if (status === "done") {
      onResult(dataRef.current);
    }
  }, [status]);

  const renderBenchArea = () => {
    return (
      <div style={{ display: "none" }}>
        {status === "idle" || status === "done" ? null : (
          <Bench reportTime={reportTime} />
        )}
      </div>
    );
  };

  const renderBenchStatus = () => {
    switch (status) {
      case "idle":
        return null;
      case "warmup":
        return `Warming up... (${mode})`;
      case "running":
        return `Running (${mode})`;
      case "done":
        return "Done";
    }
  };

  return {
    startBench,
    renderBenchArea,
    renderBenchStatus,
  };
}

type BenchComponentProps = {
  reportTime: (ms: number) => void;
};

function createBenchComponent(
  { M, N, renderTiming }: Controls,
  mode: BenchMode
): React.ComponentType<BenchComponentProps> {
  const Content = (() => {
    switch (mode) {
      case "raw":
        return RawComponent;
      case "useMemo":
        return UseMemoComponent;
      case "div":
        return DivComponent;
    }
  })();

  const Mnumbers: number[] = [];
  for (let i = 0; i < M; i++) {
    Mnumbers.push(i);
  }

  switch (renderTiming) {
    case "first": {
      return function Bench({ reportTime }) {
        const [counter, setCounter] = useState(0);
        useEffect(() => {
          if (counter < N) {
            queueMicrotask(() => {
              const startTime = performance.now();
              setCounter((c) => c + 1);
              const endTime = performance.now();
              reportTime(endTime - startTime);
            });
          }
        }, [counter, reportTime]);

        return <Content key={counter} numbers={Mnumbers} />;
      };
    }
    case "second": {
      return function Bench({ reportTime }) {
        const [counter, setCounter] = useState(0);
        useEffect(() => {
          if (counter < N) {
            queueMicrotask(() => {
              const startTime = performance.now();
              setCounter((c) => c + 1);
              const endTime = performance.now();
              reportTime(endTime - startTime);
            });
          }
        }, [counter, reportTime]);

        return <Content numbers={Mnumbers} />;
      };
    }
  }
}

type C = React.VFC<{ numbers: number[] }>;

const RawComponent: C = ({ numbers }) => {
  numbers.forEach(() => {
    const _ = {
      foo: Math.random(),
    };
    Math.random();
  });

  return (
    <>
      <p>
        Hello, <em>my</em> world!
      </p>
    </>
  );
};

const UseMemoComponent: C = ({ numbers }) => {
  numbers.forEach(() => {
    const _ = useMemo(() => {
      foo: Math.random();
    }, [Math.random()]);
  });

  return (
    <>
      <p>
        Hello, <em>my</em> world!
      </p>
    </>
  );
};

const DivComponent: C = ({ numbers }) => {
  return (
    <>
      {numbers.map((i) => (
        <div key={i} />
      ))}
      <p>
        Hello, <em>my</em> world!
      </p>
    </>
  );
};
