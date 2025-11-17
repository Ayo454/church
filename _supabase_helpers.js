// Helper to attempt upsert and automatically remove missing columns reported by PostgREST
async function upsertWithMissingColumnRetry(sbClient, table, payload, opts = {}) {
  // Make a shallow copy of payload keys so we can modify
  let current = Object.assign({}, payload);
  const maxAttempts = opts.maxAttempts || 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const query = sbClient.from(table).upsert([current], opts.upsertOptions || { onConflict: 'email' }).select();
      const { data, error } = await query;
      if (error) {
        // If PostgREST returns PGRST204, it usually indicates missing column in schema cache
        const msg = (error.message || '').toString();
        const match = msg.match(/Could not find the `?"?([a-zA-Z0-9_]+)`?"? column/i) || msg.match(/Could not find the '([a-zA-Z0-9_]+)' column/i);
        if (match && match[1]) {
          const missing = match[1];
          if (current.hasOwnProperty(missing)) {
            // remove the missing field and retry
            delete current[missing];
            continue; // retry
          }
        }
        // Other errors, return as failure
        return { data: null, error };
      }
      return { data, error: null };
    } catch (err) {
      // try to parse PostgREST-like error messages
      const msg = (err && err.message) ? err.message.toString() : String(err);
      const match = msg.match(/Could not find the `?"?([a-zA-Z0-9_]+)`?"? column/i) || msg.match(/Could not find the '([a-zA-Z0-9_]+)' column/i);
      if (match && match[1] && current.hasOwnProperty(match[1])) {
        delete current[match[1]];
        continue;
      }
      return { data: null, error: err };
    }
  }
  return { data: null, error: new Error('Retries exhausted (missing columns keep appearing)') };
}
