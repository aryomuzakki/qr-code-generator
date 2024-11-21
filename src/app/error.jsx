"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ErrorPage = ({ error, reset }) => {
  console.log(error);

  return (
    <div className="p-8">
      <Card className="w-max max-w-full bg-destructive">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">Something wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 w-max">
              <Button variant="" onClick={() => reset()}>RESET Page</Button>
              <p className="text-xs w-full text-center">or</p>
              <Button onClick={() => window.location.reload()}>RELOAD Page</Button>
              <p className="text-xs w-full text-center">or</p>
              <Button onClick={(ev) => window.location.href = "/"}>Go to Home</Button>
            </div>
            {process.env.NODE_ENV === "development" && <p className="text-sm text-foreground/80 whitespace-pre-wrap">Error Message :<br />{error?.message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorPage