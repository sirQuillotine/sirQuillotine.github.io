import "./game.css";

type Solution = [
  string, // word
  [number, number], // [i, j]
  number, // r (points)
  "r" | "d", // direction
  boolean // solved
];

interface Props {
  solutions: Solution[];
}

const PanelR = ({ solutions }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Word</th>
          <th>Pos</th>
          <th>Pts</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {solutions.map((sol, idx) => (
          <tr key={idx}>
            <td>{sol[0]}</td>
            <td>{`${sol[1][0]},${sol[1][1]}`}</td>
            <td>{sol[2]}</td>
            <td>{sol[4] ? "Solved" : "Pending"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PanelR;
