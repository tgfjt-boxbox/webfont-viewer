import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';

type HelloProps = {
  name: string
  update: (name: string) => void
}

export default function Hello({ name, update }: HelloProps) {
  const [fontName, setFontName] = useState(name);

  const handleFontName = useCallback((e: h.JSX.TargetedEvent<HTMLInputElement>) => {
    if (e.target == null) return;
  
    if ((e.target as HTMLInputElement).value !== '') {
      setFontName((e.target as HTMLInputElement).value);
    }
  }, [fontName]);

  const updateName = useCallback(() => {
    update(fontName);
  }, [fontName]);

  return (
    <div class="column is-half">
      <section class="section">
        <h2 class="title">🌈 フォント作成</h2>
        <div class="content">
          <p class="subtitle is-6">👨‍🍳 まずはじめに、作成するフォントの名前を教えてください。</p>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">フォント名</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input type="text" name="fontName" class="input" maxLength={24} onChange={handleFontName} value={fontName} />
                </div>
                <div class="control">
                  <button class="button is-info" onClick={updateName} disabled={fontName.length == 0}>これで決定</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
