import { h } from 'preact';

function fontFace(name: string, ttf: string, svg: string) {
  return `@font-face {
    font-family: "${name}";
    src: url("${ttf}") format("truetype"),
         url("${svg}") format("svg");
    font-weight: normal;
    font-style: normal;
  }`
}

type FontFaceProps = {
  name: string
  ttf: string
  svg: string
}

export default function FontFace({ name, ttf, svg }: FontFaceProps) {
  return (
    <style>
      {fontFace(name, ttf, svg)}
    </style>
  )
}
