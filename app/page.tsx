export default async function Dashboard() {
  // Health check all services
  const services = [
    { name: 'auth-service',    url: process.env.AUTH_SERVICE_URL    ?? 'http://localhost:3001' },
    { name: 'booking-service', url: process.env.BOOKING_SERVICE_URL ?? 'http://localhost:3002' },
    { name: 'pricing-service', url: process.env.PRICING_SERVICE_URL ?? 'http://localhost:3003' },
    { name: 'payment-service', url: process.env.PAYMENT_SERVICE_URL ?? 'http://localhost:3004' },
    { name: 'cargo-ledger',    url: process.env.CARGO_LEDGER_URL    ?? 'http://localhost:3005' },
  ]

  const statuses = await Promise.all(
    services.map(async (s) => {
      try {
        const res = await fetch(`${s.url}/health`, { cache: 'no-store' })
        const json = await res.json()
        return { ...s, status: 'up', detail: json }
      } catch {
        return { ...s, status: 'down', detail: null }
      }
    })
  )

  return (
    <main style={{ fontFamily: 'monospace', padding: 32 }}>
      <h1>BharatTruck — Admin Dashboard</h1>
      <h2>Service Health</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Service</th><th>Status</th><th>Port</th></tr>
        </thead>
        <tbody>
          {statuses.map(s => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td style={{ color: s.status === 'up' ? 'green' : 'red' }}>
                {s.status === 'up' ? '✓ UP' : '✗ DOWN'}
              </td>
              <td>{s.url}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 24, color: '#666' }}>
        Full ops panel — Sprint 8
      </p>
    </main>
  )
}
