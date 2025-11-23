# Datadog RUM Setup Instructions

## Installation

1. Install the Datadog Browser RUM package:

```bash
npm install @datadog/browser-rum
```

2. Create the `components/DatadogRUM.tsx` file:

```tsx
'use client'

import { useEffect } from 'react'
import { datadogRum } from '@datadog/browser-rum'
import { datadogConfig } from '@/lib/datadog'

export default function DatadogRUM() {
  useEffect(() => {
    // Only initialize if configuration is provided
    if (!datadogConfig.applicationId || !datadogConfig.clientToken) {
      console.log('Datadog RUM not configured - skipping initialization')
      return
    }

    try {
      datadogRum.init(datadogConfig)
      datadogRum.startSessionReplayRecording()
    } catch (error) {
      console.warn('Failed to initialize Datadog RUM:', error)
    }
  }, [])

  return null
}
```

3. Uncomment the import in `app/layout.tsx`:

```tsx
// Change this:
// import DatadogRUM from "@/components/DatadogRUM"; // Uncomment after installing @datadog/browser-rum

// To this:
import DatadogRUM from "@/components/DatadogRUM";
```

4. Uncomment the component usage in `app/layout.tsx`:

```tsx
// Change this:
{/* <DatadogRUM /> */}

// To this:
<DatadogRUM />
```

5. Configure environment variables in `.env`:

```env
NEXT_PUBLIC_DATADOG_APPLICATION_ID="your-app-id"
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN="your-client-token"
NEXT_PUBLIC_DATADOG_SITE="datadoghq.com"
```

6. Get your credentials from [Datadog](https://www.datadoghq.com/)

That's it! Datadog RUM will now be initialized automatically.
