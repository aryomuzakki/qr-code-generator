"use client";

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Loader2Icon, QrCode } from "lucide-react"
import QRCodeStyling from "qr-code-styling"
import ColorPicker from "./ColorPicker"
import { Label } from "./ui/label"
import { ThemeToggle } from "./ThemeToggle"
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { Skeleton } from "./ui/skeleton";
import { Slider } from "./ui/slider";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";

export default function QRGeneratorCard() {

  const [QRMainOptions, setQRMainOptions] = useState({
    width: 400,
    height: 400,
    type: 'svg',
    data: 'Hello QR',
    image: '/assets/img/R logo no outline.png',
    margin: 20,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'H',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.25,
      margin: 10,
      crossOrigin: 'anonymous',
      saveAsBlob: true,
    },
    dotsOptions: {
      color: '#09365d',
      type: "rounded",
    },
    cornersSquareOptions: {
      color: '#09365d',
      type: "",
    },
    cornersDotOptions: {
      color: '#09365d',
      type: "square",
    },
    backgroundOptions: {
      color: '#ffffff',
    },
  });

  const [QRCodeObj, setQRCodeObj] = useState();
  const QRRef = useRef(null);

  const [inputText, setInputText] = useState('Hello QR');
  const [characterCount, setCharacterCount] = useState(inputText.length);

  const [withCenterImg, setWithCenterImg] = useState(true);
  const [centerImgSrc, setCenterImgSrc] = useState("/assets/img/R logo no outline.png");

  const updateCenterImage = (ev) => {
    const imgFile = ev.target?.files[0];
    if (imgFile) {
      if (imgFile.size > 2 * 1024 * 1024) {
        toast.error("Sorry, image file size must be under 2mb");
        ev.target.value = "";
        return;
      }
      const blobFile = URL.createObjectURL(imgFile);
      setCenterImgSrc(blobFile);
      if (withCenterImg) {
        setQRMainOptions(prevValue => ({
          ...prevValue,
          image: blobFile,
        }));
      }
    }
  }

  useEffect(() => {
    try {
      setQRCodeObj(new QRCodeStyling(QRMainOptions));
    } catch (err) {
      console.log(err);
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }

    return () => {
      centerImgSrc.startsWith("blob") && URL.revokeObjectURL(centerImgSrc);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!QRRef.current) return;
    try {
      QRCodeObj && QRCodeObj?.append(QRRef.current);
    } catch (err) {
      console.log(err);
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }
  }, [QRCodeObj, QRRef])

  const generateQRCode = (e) => {
    e.preventDefault()

    try {
      QRCodeObj && QRCodeObj?.update(QRMainOptions);
    } catch (err) {
      console.log(err);
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }
  }

  useEffect(() => {
    try {
      QRCodeObj && QRCodeObj?.update(QRMainOptions);
    } catch (error) {
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }
  }, [QRMainOptions])


  const downloadQRCode = (format) => {
    QRCodeObj && QRCodeObj?.download({ name: "qr-code", extension: format });
  }

  return (
    <div className="flex flex-wrap gap-4 lg:gap-8 justify-center items-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              <h1 className="text-2xl font-bold">
                QR Code Generator
              </h1>
            </CardTitle>
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent className="relative pr-0">
          <div className="absolute -top-2 left-0 bg-gradient-to-b z-[1] from-background via-90% to-transparent w-full h-6"></div>
          <div className="absolute bottom-6 left-0 bg-gradient-to-t z-[1] from-background via-10% to-transparent w-full h-6"></div>
          <ScrollArea className="h-80 sm:h-[calc(100vh_-_53px_-_2rem_-_84px_-_24px_-_1rem)]" type="always">
            <form onSubmit={generateQRCode} className="pt-6 pl-2 pr-8 pb-8 space-y-6">

              <div className="space-y-2">
                <div className="relative">
                  <Label htmlFor="qrInput">Data</Label>
                  <p className={`absolute text-muted-foreground text-right text-xs right-0.5 bottom-0 ${characterCount === 0 || characterCount > 1273 ? "text-red-600" : ""}`}>{characterCount}</p>
                </div>
                <Textarea
                  id="qrInput"
                  name="qrInput"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setCharacterCount(e.target.value.length);

                    if (e.target.value.length > 1273) return;

                    setQRMainOptions(prevValue => ({
                      ...prevValue,
                      data: e.target.value,
                    }));
                  }}
                  placeholder="Type here ..."
                  className={`w-full ${characterCount === 0 && "ring-1 ring-red-600/70 focus-visible:ring-red-600/70"}`}
                />
                {(characterCount === 0 || characterCount > 1273) && (
                  <p className="text-red-700 dark:text-red-400 text-xs font-semibold dark:font-light h-0 !mt-1">
                    {characterCount === 0 && "Required"}
                    {characterCount > 1273 && "Maximum 1273 character"}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-x-2 w-full !mt-10">
                <h4 className="text-muted-foreground text-xs font-medium">Size</h4>
                <Separator className="shrink" />
              </div>


              <div className="">
                <Label>QR Size</Label>
                <div className="flex items-center gap-x-4">
                  <Slider
                    showValue={true}
                    min={400}
                    max={1000}
                    step={50}
                    value={[QRMainOptions.width]}
                    onValueChange={([val]) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        width: val,
                        height: val,
                      }));
                    }}
                    className=""
                  />
                  <Input
                    type="number"
                    min={400}
                    max={1000}
                    step={100}
                    value={QRMainOptions.width}
                    onChange={(ev) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        width: ev.target.value,
                        height: ev.target.value,
                      }));
                    }}
                    className="w-20 mt-4"
                  />
                </div>
              </div>

              <div className="">
                <Label>QR Margin</Label>
                <div className="flex items-center gap-x-4">
                  <Slider
                    showValue={true}
                    min={0}
                    max={100}
                    step={1}
                    value={[QRMainOptions.margin]}
                    onValueChange={([val]) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        margin: val,
                      }));
                    }}
                    className=""
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={QRMainOptions.margin}
                    onChange={(ev) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        margin: ev.target.value,
                      }));
                    }}
                    className="w-20 mt-4"
                  />
                </div>
              </div>

              <div className="flex items-center gap-x-2 w-full !mt-10">
                <h4 className="text-muted-foreground text-xs font-medium">Colors</h4>
                <Separator className="shrink" />
              </div>

              <div className="flex items-center gap-x-8">
                <div className="space-y-2">
                  <Label htmlFor="dotsColor">Foreground Color</Label>
                  <ColorPicker
                    id="dotsColor"
                    name="dotsColor"
                    onChange={(selectedColor) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        dotsOptions: {
                          color: selectedColor,
                          type: prevValue.dotsOptions.type,
                        },
                        cornersSquareOptions: {
                          color: selectedColor,
                          type: prevValue.cornersSquareOptions.type,
                        },
                        cornersDotOptions: {
                          color: selectedColor,
                          type: prevValue.cornersDotOptions.type,
                        }
                      }))
                    }}
                    value={QRMainOptions.dotsOptions.color}
                  />

                </div>
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <ColorPicker
                    id="backgroundColor"
                    name="backgroundColor"
                    onChange={(selectedColor) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        backgroundOptions: {
                          color: selectedColor,
                        }
                      }))
                    }}
                    value={QRMainOptions.backgroundOptions.color}
                  />
                </div>
              </div>

              <div className="flex items-center gap-x-2 w-full !mt-10">
                <h4 className="text-muted-foreground text-xs font-medium shrink-0">Logo Image</h4>
                <Separator className="shrink" />
              </div>

              <div className="flex items-center gap-x-2">
                <Switch
                  id="withCenterImg"
                  checked={withCenterImg}
                  onCheckedChange={(val) => {
                    setWithCenterImg(val);
                    setQRMainOptions(prevValue => ({
                      ...prevValue,
                      image: val ? centerImgSrc : null,
                    }));

                  }}
                />
                <Label htmlFor="withCenterImg" className={`select-none ${QRMainOptions.image ? "" : "text-foreground/80"}`}>Use logo image</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <Switch
                  id="allowTransparency"
                  checked={QRMainOptions.imageOptions.hideBackgroundDots}
                  onCheckedChange={(val) => {
                    setQRMainOptions(prevValue => ({
                      ...prevValue,
                      imageOptions: {
                        ...prevValue.imageOptions,
                        hideBackgroundDots: val,
                      }
                    }));
                  }}
                />
                <Label htmlFor="allowTransparency" className={`select-none ${QRMainOptions.imageOptions.hideBackgroundDots ? "" : "text-foreground/80"}`}>Remove dots around image</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="centerImage">Upload Image</Label>
                <Input
                  type="file"
                  id="centerImage"
                  name="centerImage"
                  accept="image/*"
                  className="p-0 file:hover:bg-accent/15 file:h-full file:mr-2 file:px-3 file:border-r file:border-r-muted-foreground file:active:border-r-muted-foreground file:active:bg-muted-foreground file:transition-colors file:duration-100"
                  onChange={updateCenterImage}
                />
              </div>

              <div className="">
                <Label>Image Size</Label>
                <div className="flex items-center gap-x-4">
                  <Slider
                    showValue={true}
                    min={0.1}
                    max={0.5}
                    step={0.01}
                    value={[QRMainOptions.imageOptions.imageSize]}
                    onValueChange={([val]) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        imageOptions: {
                          ...prevValue.imageOptions,
                          imageSize: val,
                        }
                      }));
                    }}
                    className=""
                  />
                  <Input
                    type="number"
                    min={0.1}
                    max={0.5}
                    step={0.01}
                    value={QRMainOptions.imageOptions.imageSize}
                    onChange={(ev) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        imageOptions: {
                          ...prevValue.imageOptions,
                          imageSize: ev.target.value,
                        }
                      }));
                    }}
                    className="w-20 mt-4"
                    lang="en"
                  />
                </div>
              </div>

              <div className="">
                <Label>Margin Size</Label>
                <div className="flex gap-x-4">
                  <Slider
                    showValue={true}
                    min={0}
                    max={50}
                    step={1}
                    value={[QRMainOptions.imageOptions.margin]}
                    onValueChange={([val]) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        imageOptions: {
                          ...prevValue.imageOptions,
                          margin: val,
                        }
                      }));
                    }}
                    className=""
                  />
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    value={QRMainOptions.imageOptions.margin}
                    onChange={(ev) => {
                      setQRMainOptions(prevValue => ({
                        ...prevValue,
                        imageOptions: {
                          ...prevValue.imageOptions,
                          margin: ev.target.value,
                        }
                      }));
                    }}
                    className="w-20 mt-4"
                  />
                </div>
              </div>

            </form>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        {/* <CardHeader>
          <Button type="button" className="w-full" onClick={generateQRCode}>Generate QR Code</Button>
        </CardHeader> */}
        <CardContent className="flex flex-col items-center space-y-4 pt-6">
          <div className="relative flex justify-center items-center w-full aspect-square bg-muted">
            <Skeleton className="absolute inset-0 flex justify-center items-center">
              <Loader2Icon className="animate-spin"></Loader2Icon>
            </Skeleton>
            <div className="z-10 w-full h-full [&_svg]:w-full [&_svg]:h-full overflow-hidden rounded" ref={QRRef} />
          </div>
          <div className="flex justify-between gap-4 w-full">
            <Button className="w-full" onClick={() => downloadQRCode('svg')} {...QRRef.current ? {} : { disabled: "disabled" }}>
              <Download className="mr-1 h-4 w-4" />Download SVG
            </Button>
            <Button className="w-full" onClick={() => downloadQRCode('png')} {...QRRef.current ? {} : { disabled: "disabled" }}>
              <Download className="mr-1 h-4 w-4" />Download PNG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}