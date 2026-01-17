export default function Leaderboard({ players, onBack }) {
  const sortedPlayers = [...players].sort((a, b) => b.totalWins - a.totalWins);

  return (
    <div style={{ padding: 24 }}>
      <h2>Global Leaderboard</h2>
      <button onClick={onBack}>Back</button>

      <table
        style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Rank</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Player</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>Total Wins</th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>
              Games Played
            </th>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>
              Last Played
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.id}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: 8,
                  textAlign: "center",
                }}
              >
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {player.name}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: 8,
                  textAlign: "center",
                }}
              >
                {player.totalWins}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: 8,
                  textAlign: "center",
                }}
              >
                {player.gamesPlayed}
              </td>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                {new Date(player.lastPlayed).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
