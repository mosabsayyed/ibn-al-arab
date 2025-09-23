export function mdToHtml(md: string) {
  // Very small markdown -> HTML converter for static docs used in-app.
  // Supports headings, paragraphs, and simple line breaks and lists.
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  for (let raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      continue;
    }

    // headings like '#', '##'
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = escape(h[2]);
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // ordered list like '1. '
    const ol = line.match(/^[0-9]+\.\s+(.*)$/);
    if (ol) {
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${escape(ol[1])}</li>`);
      continue;
    }

    // paragraphs
    out.push(`<p>${escape(line)}</p>`);
  }

  if (inList) out.push('</ul>');
  return out.join('\n');
}
