import { getPayload } from 'payload'
import config from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const entries = await payload.find({
    collection: 'entries',
    where: { _status: { equals: 'published' } },
    limit: 100,
  })

  const news = await payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    limit: 5,
    sort: '-publishDate',
  })

  const events = await payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit: 10,
    sort: '-date',
  })

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Tech Atlas — CMS Foundation</h1>
      <p>Plan 1 complete. All collections operational.</p>

      <h2>Entries ({entries.totalDocs})</h2>
      <ul>
        {entries.docs.map((entry) => (
          <li key={entry.id}>
            [{entry.entryType}] {entry.name} — {entry.city}
          </li>
        ))}
      </ul>

      <h2>News ({news.totalDocs})</h2>
      {news.totalDocs === 0 && <p>No news yet. Create one in /admin.</p>}
      <ul>
        {news.docs.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>

      <h2>Events ({events.totalDocs})</h2>
      {events.totalDocs === 0 && <p>No events yet. Create one in /admin.</p>}
      <ul>
        {events.docs.map((event) => (
          <li key={event.id}>{event.title} — {event.date}</li>
        ))}
      </ul>
    </div>
  )
}
