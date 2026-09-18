import { Fragment } from "react";

/**
 * Renders the model's Markdown output as readable formatted text — headings,
 * lists and paragraphs — rather than dumping raw text or JSON on the page.
 * Deliberately small: the six headings, bullets, numbered items and bold runs
 * are all the Parameters component asks the model for.
 */

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "paragraph"; text: string };

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  function flushParagraph() {
    if (paragraph.length > 0) {
      // Line breaks are kept: the model uses them to separate an example
      // headline from the call to action under it.
      blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
      paragraph = [];
    }
  }

  function flushList() {
    if (list) {
      blocks.push({ kind: "list", ordered: list.ordered, items: list.items });
      list = null;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        kind: "heading",
        level: heading[1].length <= 2 ? 2 : 3,
        text: heading[2].replace(/:$/, ""),
      });
      continue;
    }

    const bullet = /^[-*•]\s+(.*)$/.exec(trimmed);
    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);

    if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      const item = (bullet ?? numbered)![1];
      if (list && list.ordered === ordered) {
        list.items.push(item);
      } else {
        flushList();
        list = { ordered, items: [item] };
      }
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

/** Bold runs, the only inline mark the output format asks for. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-medium text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function FormattedText({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return block.level === 2 ? (
            <h3
              key={index}
              className="border-b border-border pt-3 pb-2 text-sm font-medium uppercase tracking-[0.16em] text-accent"
            >
              {block.text}
            </h3>
          ) : (
            <h4 key={index} className="pt-1 text-sm font-medium text-foreground">
              {block.text}
            </h4>
          );
        }

        if (block.kind === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={index}
              className={`space-y-2 pl-5 text-sm leading-relaxed text-muted ${
                block.ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="pl-1">
                  <Inline text={item} />
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <p
            key={index}
            className="text-sm leading-relaxed whitespace-pre-line text-muted"
          >
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
