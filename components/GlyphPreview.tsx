import { h, } from 'preact';
import { StateUpdater } from 'preact/hooks';
import { WithMetadata } from '../src/icon-streams';

type GlyphPreviewProps = {
  fontName: string;
  iconStreams: WithMetadata[];
  codePoints: number[];
  fileList: File[];
  setCodePoints: StateUpdater<number[]>
}

export default function GlyphPreview({ iconStreams, fontName, codePoints, fileList, setCodePoints }: GlyphPreviewProps) {
  return (
    <section class="section">
      <h2 class="title">🔠 Glyphs</h2>
      <div>
        <ol class="columns is-multiline is-mobile">
          {
            iconStreams.map((s, i) => (
              <li class="column">
                <div class="c2">
                  <header class="c2-header" style={{ fontFamily: fontName, fontSize: '2rem' }}>
                    <strong>{s.metadata.unicode[0]}</strong>
                  </header>
                  <div class="c2-content">
                    <table class="table is-narrow">
                      <tr>
                        <th class="is-size-7">Glyph</th>
                        <td>
                          <input type="text" name="unicode" maxLength={1}
                            class="input"
                            value={s.metadata.unicode[0]}
                            onChange={(e) => {
                              const target = e.target as HTMLInputElement;

                              if (target.value == '') return;

                              const newPoints = [...codePoints];
                              newPoints[i] = target.value.charCodeAt(0);
                              setCodePoints(newPoints);
                            }}
                            onFocus={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            style={{ fontFamily: 'monospace' }}/>
                        </td>
                      </tr>
                      <tr>
                        <th class="is-size-7">Unicode</th>
                        <td class="is-size-7"><code>{s.metadata.unicode[0].charCodeAt(0).toString(16)}</code></td>
                      </tr>
                      <tr>
                        <th class="is-size-7">Filename</th>
                        <td class="is-size-7"><code>{fileList[i].name}</code></td>
                      </tr>
                    </table>
                  </div>
                </div>
              </li>
            ))
          }
        </ol>
      </div>
    </section>

  )
}