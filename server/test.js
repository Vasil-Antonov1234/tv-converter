import fs from "node:fs";
import chardet from "chardet";
import iconv from "iconv-lite";
import jschardet from "jschardet";

const inputFilePath = "C:/Vase/-TV-/";

const buffer = fs.readFileSync(`${inputFilePath}ntv.txt`)

const char = jschardet.detect(buffer).encoding;

const encoded = iconv.decode(buffer, char);

console.log(char)

fs.writeFileSync(`${inputFilePath}ntv-1.txt`, encoded, { encoding: "utf-8"});
