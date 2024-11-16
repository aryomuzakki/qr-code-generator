"use client";

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, QrCode } from "lucide-react"
import QRCodeStyling from "qr-code-styling"
import ColorPicker from "./ColorPicker"
import { Label } from "./ui/label"
import { ThemeToggle } from "./ThemeToggle"
import { toast } from "sonner";

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
      errorCorrectionLevel: 'H'
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.05,
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

  useEffect(() => {
    try {
      setQRCodeObj(new QRCodeStyling(QRMainOptions));
    } catch (err) {
      console.log(err);
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }
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

    if (characterCount < 8) {
      toast.error("Minimum data/text length is 8 character");
      return;
    }
    if (characterCount > 1273) {
      toast.error("Maximum data/text length is 1273 character for Highest Error Correction Level in Byte Mode");
      return;
    }

    setQRMainOptions(prevValue => ({
      ...prevValue,
      data: inputText
    }));

    try {
      QRCodeObj && QRCodeObj?.update({
        ...QRMainOptions,
        data: inputText
      });
    } catch (err) {
      console.log(err);
      toast.error("Error trying to generate QR Code. Please check input data or other settings");
    }
  }

  const downloadQRCode = (format) => {
    QRCodeObj && QRCodeObj?.download({ name: "qr-code", extension: format });
  }

  return (
    <div className="flex flex-wrap gap-4 lg:gap-8 justify-center items-start">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">QR Code Generator</CardTitle>
            <ThemeToggle />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={generateQRCode} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Label htmlFor="qrInput">Data</Label>
                <p className={`absolute text-muted-foreground text-right text-xs right-0.5 bottom-0 ${characterCount < 8 ? "text-red-600" : ""}`}>{characterCount}</p>
              </div>
              <Input
                type="text"
                id="qrInput"
                name="qrInput"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setCharacterCount(e.target.value.length);
                }}
                placeholder="Hello QR"
                className="w-full"
              />
            </div>
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
          </form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <Button type="button" className="w-full" onClick={generateQRCode}>Generate QR Code</Button>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="flex justify-center items-center">
            <div className="w-full h-full [&_svg]:w-full [&_svg]:h-full overflow-hidden rounded" ref={QRRef} />
          </div>
          <div className="flex flex-wrap justify-around gap-4 w-full">
            <Button onClick={() => downloadQRCode('svg')}>
              <Download className="mr-1 h-4 w-4" />Download SVG
            </Button>
            <Button onClick={() => downloadQRCode('png')}>
              <Download className="mr-1 h-4 w-4" />Download PNG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}