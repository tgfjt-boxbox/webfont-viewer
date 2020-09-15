import stream from 'stream';

const Stream = stream.PassThrough;

type CodePoint = number;

export type WithMetadata = stream.PassThrough & {
  metadata: {
    unicode: string[],
    name: string
  }
}

function createStream(file: File, codepoint: CodePoint) {
  const iconStream = new Stream() as WithMetadata;
  const reader = new FileReader();
  const matches = file.name.match(/^(?:u([0-9a-f]{4})\-)?(.*).svg$/i);

  if (matches == null) {
    throw new Error("wrong filename.");
  }

  reader.onload = (e) => {
    iconStream.write(e.target?.result, 'utf8');
    iconStream.end();
  };

  reader.readAsText(file);

  iconStream.metadata = {
    unicode: [String.fromCharCode(codepoint)],
    name: matches[2].replace(/"/, '22')
  };

  return iconStream;
}

export function createIconstreams(fileList: File[], codePoints: CodePoint[]) {
  if(!fileList.length) {
    return [];
  }

  return fileList.map((file, i) => createStream(file, codePoints[i]));
};
