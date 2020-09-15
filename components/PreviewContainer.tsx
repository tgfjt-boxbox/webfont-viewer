import { h } from 'preact';
import { useState, useRef, useEffect, useCallback, useMemo } from 'preact/hooks';

import { createIconstreams } from '../src/icon-streams';
import { FontBundler } from '../src/font-bundler';
import { DEFAULT_CODEPOINT } from '../src/config';
import FontFace from './FontFace';
import GlyphPreview from './GlyphPreview';
import Hello from './Hello';
import GivemeSVG from './GivemeSVG';

const DEFAULT_FONT_NAME = 'Sample Sans';

export default function PreviewContainer() {
  const [fileList, setFileList] = useState<File[]>([]);
  const [codePoints, setCodePoints] = useState([DEFAULT_CODEPOINT]);
  const [named, setNamed] = useState(false);
  const [fontName, setFontName] = useState(DEFAULT_FONT_NAME);
  const [fontSize, setFontSize] = useState(20);
  const [fontUrls, setFontUrls] = useState({ ttf: '', svg: ''});
  const zipFile = useRef({} as Blob);

  const updateFontName = useCallback((newName: string) => {
    setFontName(newName);
    setNamed(true);
  }, [fontName]);

  const handleFiles = useCallback((result: File[]) => {
    setFileList(result);
    setCodePoints(result.map((_, i) => DEFAULT_CODEPOINT + i));
  }, [fontName]);

  const iconStreams = useMemo(() => createIconstreams(fileList, codePoints), [fileList, codePoints]);

  const handleDownload = useCallback((e: h.JSX.TargetedEvent<HTMLAnchorElement, MouseEvent>) => {
    const target = e.target as HTMLAnchorElement;
    if (target.href) {
      window.URL.revokeObjectURL(target.href);
    }
    target.href = window.URL.createObjectURL(zipFile.current);
    target.download = `${fontName}.zip`;
  }, [zipFile]);

  const handleReset = useCallback(() => {
    setFontName(DEFAULT_FONT_NAME);
    setNamed(false);
    setFileList([]);
  }, []);

  useEffect(() => {
    if (fileList.length === 0) return;

    const fontBundler = new FontBundler({
      fontName: fontName,
      fontHeight: 150,
      descent: 0,
      fixedWidth: false,
      normalize: false
    });
  
    fontBundler.bundle(iconStreams, (result) => {
      setFontUrls(result.urls);
      zipFile.current = result.zip;
    });
  }, [iconStreams, fontName]);

  return (
    <div>
      <nav class="navbar is-fixed-bottom is-transparent">
        <div class="container">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                { named && <button class="button is-danger" onClick={handleReset}><strong>はじめからやり直す</strong></button> }
                { fileList.length > 0 && <a class="button is-primary" onClick={handleDownload}>SVG &amp; TTFをダウンロード</a>}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div class="container">
        {
          fileList.length > 0 && <FontFace name={fontName} ttf={fontUrls.ttf} svg={fontUrls.svg} />
        }

        <div class="columns is-centered">
          { !named && <Hello name={fontName} update={updateFontName} /> }
          { named && fileList.length == 0 && <GivemeSVG name={fontName} update={handleFiles} /> }

          {
            fileList.length > 0 && (
              <div class="column">
                <section class="section">
                  <h2 class="title">💡 プレビュー</h2>
                  <div class="field">
                    <label class="label">フォントサイズ</label>
                    <div class="control">
                      <input type="range" name="fontSize" min={10} max={128} value={fontSize} step={1} onChange={(e) => {
                        const v = (e.target as HTMLInputElement).value || '';
                        setFontSize(Number(v));
                      }} />
                    </div>
                  </div>
                  { fileList.length > 0 && (
                    <div class="box">
                      <div class="content">
                        <div class="preview" style={{ fontFamily: fontName, fontSize: `${fontSize}px` }} contentEditable={true}>
                          {
                            iconStreams.map(s => s.metadata.unicode[0])
                          }
                        </div>
                        <p class="mt-3 pt-3">🖕 ここに入力して確かめることが出来ます。</p>
                        <p>👇 Glyph の初期マッピングは、あまり利用されない字体に設定しています。利用したい Glyph に変更してください🙏</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )
          }

        </div>

        {
          fileList.length > 0 && <GlyphPreview
            iconStreams={iconStreams}
            fontName={fontName}
            fileList={fileList}
            codePoints={codePoints}
            setCodePoints={setCodePoints} />
        }

      </div>
    </div>
  )
}
