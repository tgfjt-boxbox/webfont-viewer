import { StringDecoder } from 'string_decoder';
import svgicons2svgfont from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import JSZip from 'jszip';
import { WithMetadata } from '../src/icon-streams';

const TTF = 'ttf' as const;
const SVG = 'svg' as const;

type FileTypes = typeof TTF | typeof SVG;

type FontURL = {
  [k in FileTypes]: string;
}

type FontResult = {
  urls: FontURL,
  zip: Blob
}

function FontURL(): FontURL {
  return {
    [TTF]: '',
    [SVG]: ''
  }
}

function isEnableCreateObjectURL() {
  return window && window.URL && window.URL.createObjectURL;
}

const MAKESVG = Symbol('makeSVG');
const URLS = Symbol('URLS');
const ZIP = Symbol('ZIP');
const OPTIONS = Symbol('OPTIONS');

export class FontBundler {
  [URLS]: FontURL;
  [ZIP]: JSZip | null;
  [OPTIONS]: any;
  [MAKESVG]: (iconStreams: WithMetadata[], callback: (content: string) => void) => void;

  constructor(options: Partial<Svgicons2svgfontOptions>) {
    this[URLS] = FontURL();
    this[ZIP] = new JSZip();
    this[OPTIONS] = {
      ...options,
      fontName: options.fontName || 'previewfont'
    };

    this[MAKESVG] = (iconStreams, callback) => {
      const parts: string[] = [];
      const decoder = new StringDecoder('utf8');
      const fontStream = new svgicons2svgfont(this[OPTIONS]);

      fontStream.on('data', (chunk) => {
        parts.push(decoder.write(chunk));
      });

      fontStream.on('finish', () => {
        if (isEnableCreateObjectURL()) {
          this[URLS].svg = window.URL.createObjectURL(new Blob(parts, {type: 'image/svg+xml'}));
        }

        callback(parts.join(''));
      });

      iconStreams.forEach(s => {
        fontStream.write(s)
      });
      fontStream.end();
    }
  }

  bundle(icons: WithMetadata[], callback: (result: FontResult) => void) {
    if (isEnableCreateObjectURL()) {
      for (const prop in this[URLS]) {
        window.URL.revokeObjectURL(this[URLS][prop as FileTypes]);
      }
    }

    this[MAKESVG](icons, (content) => {
      this[ZIP]?.file(`${this[OPTIONS].fontName}.svg`, content);

      // TODO(tgfjt):　optional settings
      // {
      //   url: 'https:///',
      //   description: 'hogehoge',
      //   version: '0.1',
      //   copyright: 'tgfjt'
      // }
      const ttfFontBuffer = svg2ttf(content).buffer;

      if (isEnableCreateObjectURL()) {
        this[URLS].ttf = window.URL.createObjectURL(
          new Blob([ttfFontBuffer], {type: 'application/octet-stream'})
        );
      }

      this[ZIP]?.file(`${this[OPTIONS].fontName}.ttf`, ttfFontBuffer);

      this[ZIP]?.generateAsync({ type:'blob', compression:'DEFLATE' })
        .then((content) => {
          callback({
            urls: this[URLS],
            zip: content
          });
          this[URLS] = FontURL();
          this[ZIP] = null;
        });
    });
  }
}
