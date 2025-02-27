"use client";

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CameraOffIcon, FlashlightIcon as FlashlightOnIcon, Copy, ExternalLink, Loader2Icon, UploadIcon, CameraIcon, FlashlightOffIcon, RotateCcwIcon } from "lucide-react"
import { Textarea } from "./ui/textarea"
import QrScanner from "qr-scanner"
import throttle from "lodash.throttle"
import { copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"
import debounce from "lodash.debounce"
import { ThemeToggle } from "./ThemeToggle"
import { Input } from "./ui/input";


export default function QRScannerCard() {
  const videoRef = useRef(null)
  const [QRScannerObj, setQRScannerObj] = useState()
  const [scannedResult, setScannedResult] = useState('')
  const [expandedResult, setExpandedResult] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [facingMode, setFacingMode] = useState("environment")
  const [cameraList, setCameraList] = useState([])
  const [isFlashExist, setIsFlashExist] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [loadingScanner, setLoadingScanner] = useState(true)

  const QRScannerOptions = {
    returnDetailedScanResult: true,
    // onDecodeError: handleScanError,
    // maxScansPerSecond: 25,
    highlightScanRegion: true,
    highlightCodeOutline: true,
  }

  useEffect(() => {

    let qrScanner;

    const debStopScan = debounce(async () => {
      await qrScanner.stop();
      setIsScanning(false)
    }, 6000)

    const handleResult = throttle(async (scanResult) => {
      setScannedResult(scanResult.data);
      toast.success("QR Scanned");
      debStopScan();
    }, 3000, { trailing: false })

    qrScanner = new QrScanner(videoRef.current, handleResult, QRScannerOptions);

    setQRScannerObj(qrScanner)

    return () => {
      if (QRScannerObj) {
        QRScannerObj.stop()
        QRScannerObj.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startScanning = async () => {

    setLoadingScanner(true);

    await QRScannerObj.start().then(() => {
      setIsScanning(true);

      QrScanner.listCameras(true).then((cameras) => {
        console.log(cameras);
        setCameraList(cameras)
      });

      QRScannerObj.hasFlash().then((result) => {
        setIsFlashExist(result);
      });
    }).catch((err) => {
      if (err.toLowerCase().includes("camera not found")) {
        navigator.permissions.query({ name: "camera" }).then((permission) => {
          if (permission.state === "denied") {
            toast.error("Camera access is denied. Please reset your camera permission in browser settings. Err: " + err);
          } else if (permission.state === "granted") {
            console.error("Camera access is granted but we cannot find/use any camera in your device. Try to check your camera hardware");
          } else {
            console.error("Please grant access to your camera");
          }
        }).catch((err) => {
          console.error("Error while trying to check camera permission", err);

          console.error("Camera not found or permission is not given. Try to reset camera permission");
        });
      } else {
        toast.error("Error while trying to start QR Scanner. Err:" + err);
      }

      console.log("Checking for camera in this device");
      QrScanner.hasCamera().then((result) => {
        if (result) {
          console.log("Camera exist in this device");
        }
      }).catch((err) => {
        console.error("error checking if device has camera", err);
      });
    }).finally(() => setLoadingScanner(false));
  }

  useEffect(() => {
    if (QRScannerObj) {
      startScanning();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QRScannerObj])

  const toggleScanning = async () => {
    console.log(isScanning ? 'Stopping camera...' : 'Starting camera...')
    if (isScanning) {
      await QRScannerObj.stop()
      setIsScanning(!isScanning);
    } else {
      await startScanning();
    }
  }

  const toggleFlash = async () => {
    console.log(flashOn ? 'Turning flash off...' : 'Turning flash on...')
    if (flashOn) {
      await QRScannerObj.turnFlashOff();
    } else {
      await QRScannerObj.turnFlashOn();
    }
    setFlashOn(!flashOn)
  }

  const switchCamera = () => {
    const newPreferredCamera = facingMode === "user" ? "environment" : "user";
    QRScannerObj.setCamera(newPreferredCamera).then(() => {
      setFacingMode(newPreferredCamera);
    }).catch((err) => {
      console.error("Error while trying to switch camera", err);
    });
  }

  const uploadImage = () => {
    document.getElementById("qrImageFile").click();
  }

  const scanUploadedImage = (ev) => {
    const file = ev.target.files[0];
    QrScanner.scanImage(file, { returnDetailedScanResult: true, })
      .then(scanResult => {
        setScannedResult(scanResult.data);
        toast.success("QR Scanned");
      })
      .catch(() => {
        toast.error("QR Code Not Found");
      });
  }

  const copyText = () => {
    copyToClipboard(scannedResult);
    toast.success("Text Copied");
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div className="flex flex-col">
      <Card className="flex-grow relative overflow-hidden border-0 border-none rounded-none">
        <CardHeader className="absolute top-0 left-0 right-0 z-10 bg-background border rounded-b-xl py-2.5">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              QR Code Scanner
            </CardTitle>
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-dvh flex justify-center relative">
            <div className="bg-muted-foreground w-full flex items-center justify-center">
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-muted text-sm">
                  {loadingScanner ? (
                    <>
                      <Loader2Icon className="size-16 animate-spin" />
                      <p>{loadingScanner && "Starting Scanner"}</p>
                    </>
                  ) : (
                    <>
                      <CameraOffIcon className="w-16 h-16" />
                      <p>Scanner Currently Off</p>
                      <Button variant="outline" className="bg-muted-background mt-4" onClick={startScanning}>
                        Start Scan
                      </Button>
                    </>
                  )}
                </div>
              )}
              <video className={isScanning ? "" : "-z-10"} ref={videoRef}></video>
            </div>
            <div className="absolute bottom-28 left-2 right-2 flex justify-between dark">
              <div className="flex flex-col gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  // className="size-14 [&_svg]:size-6 rounded-full bg-transparent bg-[radial-gradient(circle,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.20)_30%,_rgba(0,0,0,0)_60%)] hover:bg-secondary/15 hover:backdrop-blur-[2px] text-foreground border border-foreground shadow-[inset_0_0_10px_0px_#00000080,_0_0_10px_0px_#00000080]"
                  className="size-14 [&_svg]:size-6 rounded-full bg-secondary/30 disabled:opacity-25 hover:bg-secondary/40 backdrop-blur-[2px] text-foreground border border-foreground shadow-[0_0_10px_0px_#00000020]"
                  onClick={toggleScanning}
                  title="Toggle Scanning Start/Stop"
                >
                  {isScanning ? <CameraIcon className="svg" /> : <CameraOffIcon className="svg" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  // className="size-14 [&_svg]:size-6 rounded-full bg-transparent bg-[radial-gradient(circle,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.20)_30%,_rgba(0,0,0,0)_60%)] hover:bg-secondary/15 hover:backdrop-blur-[2px] text-foreground border border-foreground shadow-[inset_0_0_10px_0px_#00000080,_0_0_10px_0px_#00000080]"
                  className="size-14 [&_svg]:size-6 rounded-full bg-secondary/30 disabled:opacity-25 hover:bg-secondary/40 backdrop-blur-[2px] text-foreground border border-foreground shadow-[0_0_10px_0px_#00000020]"
                  onClick={uploadImage}
                  title="Upload QR Code from Gallery or File"
                // disabled
                >
                  <UploadIcon className="svg" />
                  <Input type="file" accept="image/*" name="qrImageFile" id="qrImageFile" className="hidden" hidden onChange={scanUploadedImage} />
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  // className="size-14 [&_svg]:size-6 rounded-full bg-transparent bg-[radial-gradient(circle,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.20)_30%,_rgba(0,0,0,0)_60%)] hover:bg-secondary/15 hover:backdrop-blur-[2px] text-foreground border border-foreground shadow-[inset_0_0_10px_0px_#00000080,_0_0_10px_0px_#00000080]"
                  className="size-14 [&_svg]:size-6 rounded-full bg-secondary/30 disabled:opacity-25 hover:bg-secondary/40 backdrop-blur-[2px] text-foreground border border-foreground shadow-[0_0_10px_0px_#00000020]"
                  onClick={toggleFlash}
                  title="Toggle Flashlight On/Off"
                  {...isFlashExist ? {} : { disabled: "disabled" }}
                >
                  {flashOn ? <FlashlightOnIcon className="svg" /> : <FlashlightOffIcon className="svg" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  // className="size-14 [&_svg]:size-6 rounded-full bg-transparent bg-[radial-gradient(circle,_rgba(0,0,0,0.7)_0%,_rgba(0,0,0,0.20)_30%,_rgba(0,0,0,0)_60%)] hover:bg-secondary/15 hover:backdrop-blur-[2px] text-foreground border border-foreground shadow-[inset_0_0_10px_0px_#00000080,_0_0_10px_0px_#00000080]"
                  className="size-14 [&_svg]:size-6 rounded-full bg-secondary/30 disabled:opacity-25 hover:bg-secondary/40 backdrop-blur-[2px] text-foreground border border-foreground shadow-[0_0_10px_0px_#00000020]"
                  onClick={switchCamera}
                  title="Switch Camera"
                  {...cameraList.length > 1 ? {} : { disabled: "disabled" }}
                >
                  <RotateCcwIcon className="svg" />
                </Button>
              </div>


            </div>
          </div>
          <Card className={`absolute rounded-b-none border-b-0 bottom-0 left-0 right-0 ${expandedResult ? "" : "h-24"}`}>
            <CardContent className="flex justify-center items-center px-4 py-8 relative h-full">
              <div className={`w-full flex items-center gap-4  ${expandedResult ? "items-stretch" : ""}`}>
                {scannedResult ? (
                  <>
                    {expandedResult ? (
                      <Textarea className="text-sm min-h-32 disabled:opacity-100" disabled value={scannedResult} />
                    ) : (
                      <>
                        <p className="text-sm w-full truncate p-2 border rounded"> {scannedResult} </p>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground py-2 text-center w-full">Scan a QR Code with your camera, the result will be displayed here</p>
                )}
                {scannedResult && (
                  <div className={`flex items-center gap-4 ${expandedResult ? "flex-col justify-around" : ""}`}>
                    {isValidUrl(scannedResult) && (
                      <Button size="icon" title="Open Link in New Tab">
                        <a href={scannedResult} target="_blank" rel="noreferrer noopener">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="icon" title="Copy Text" onClick={copyText}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {scannedResult && (
                <div className="absolute top-0 left-0 right-0 bottom-0 -translate-y-1/2 flex justify-center items-center h-0">
                  <Button size="sm" variant="secondary" className="backdrop-blur" title="Toggle Result Text Detail/Compact" onClick={() => setExpandedResult(!expandedResult)}>
                    {expandedResult ? "Hide" : "Show"} Detailed Result
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card >
    </div >
  )
}