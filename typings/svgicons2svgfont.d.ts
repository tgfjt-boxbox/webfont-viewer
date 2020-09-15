type Svgicons2svgfontOptions = {
  fontName: string
  fontHeight: number
  fontId: string
  fixedWidth: boolean
  normalize: boolean
  descent: number
  round: number
  metadata: string
  log: any;
};

declare module "svgicons2svgfont" {
  import { Transform } from 'stream';

  export = class svgicons2svgfont extends Transform {
    constructor(opts: Svgicons2svgfontOptions)
  };
}
