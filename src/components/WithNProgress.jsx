"use client";

import { AppProgressBar } from "next-nprogress-bar";

const WithNProgress = ({ props }) => {
  return (
    <AppProgressBar
      color="#1071cc"
      options={{ showSpinner: true }}
      shallowRouting
      {...props}
    />
  )
}

export default WithNProgress