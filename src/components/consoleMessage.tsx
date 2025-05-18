// app/components/ConsoleMessage.tsx
'use client'

import { useEffect } from 'react'

export default function ConsoleMessage() {
  useEffect(() => {
    console.log(
        "%cStop!",
        "color: red; font-size: 40px; font-weight: bold;"
      );
      console.log(
        "%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it could be a scam.",
        "font-size: 16px;"
      );
  }, [])

  return null
}
