import { h } from 'preact';
import { useRef, useCallback, Ref } from 'preact/hooks';

type GivemeSVGProps = {
  name: string
  update: (fileList: File[]) => void
}

export default function GivemeSVG({ name, update }: GivemeSVGProps) {
  const fileRef = useRef({} as HTMLInputElement);

  const handleFiles = useCallback(() => {
    if (fileRef.current == null) return;

    const result = [] as File[];
    const { files }  = fileRef.current;

    if (files == null) return;

    for (let i = 0; i < files.length; i++) {
      result.push(files[i]);
    }

    result.sort((a, b) => {
      if (a.name < b.name)  return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    update(result);
  }, [fileRef]);

  return (
    <div class="column is-half">
      <section class="section">
        <h2 class="title">🌈 フォント作成</h2>
        <div class="cond">
          <div class="field">
            <p class="subtitle is-6">👨‍🍳 次に、フォントにしたい文字の SVG（１文字ずつのファイル）を選択してください。</p>
            <div class="control">
              <div class="file is-boxed is-primary">
                <label class="file-label">
                  <input type="file" name="svgs" multiple={true} class="file-input" onChange={handleFiles} ref={fileRef} />
                  <div class="file-cta">
                    <span class="file-label">SVGファイルをまとめて選択</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
