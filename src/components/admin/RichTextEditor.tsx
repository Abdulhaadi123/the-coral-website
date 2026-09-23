'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Mark, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  Undo2,
  Redo2,
  Palette,
  RemoveFormatting,
} from 'lucide-react';

const TextStyleColor = Mark.create({
  name: 'textColor',
  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.style.color || null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return { style: `color: ${attributes.color}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'span[style*=color]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

const COLOR_PRESETS = [
  { label: 'Default (Dark)', value: '#111827' },
  { label: 'Muted Gray', value: '#4B5563' },
  { label: 'Brand Green', value: '#5E9738' },
  { label: 'Teal', value: '#21A0A3' },
  { label: 'Blue', value: '#2563EB' },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-[#111827] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const colorMenuRef = useRef<HTMLDivElement>(null);

  // Close color menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
        setShowColorMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyleColor,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write the post content here…',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'journal-prose journal-prose--editor focus:outline-none',
      },
      transformPastedHTML(html) {
        // Automatically strip white text and dark backgrounds so pasted content is always visible
        return html
          .replace(/color\s*:\s*(#fff(fff)?|white|rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255,[^)]+\))\s*;?/gi, '')
          .replace(/background(-color)?\s*:\s*[^;"]+;?/gi, '');
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep the editor in sync when the form is reset/loaded asynchronously
  // (e.g. the edit page populating fields after its initial fetch).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return;
      if (!color) {
        editor.chain().focus().unsetMark('textColor').run();
      } else {
        editor.chain().focus().setMark('textColor', { color }).run();
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#78B249] bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-100 bg-gray-50/70">
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
          <Pilcrow className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Numbered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Add Link" active={editor.isActive('link')} onClick={setLink}>
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Remove Link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
          <Link2Off className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        {/* Text Color Picker */}
        <div className="relative" ref={colorMenuRef}>
          <button
            type="button"
            title="Text Color"
            onClick={() => setShowColorMenu((prev) => !prev)}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              showColorMenu ? 'bg-gray-200 text-black' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Palette className="w-4 h-4" />
          </button>

          {showColorMenu && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-2.5 flex flex-col gap-2 min-w-[170px]">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Text Color</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      setColor(c.value);
                      setShowColorMenu(false);
                    }}
                    className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
              <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs">
                <label className="flex items-center gap-1.5 text-gray-700 hover:text-black cursor-pointer">
                  <input
                    type="color"
                    className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    onChange={(e) => {
                      setColor(e.target.value);
                      setShowColorMenu(false);
                    }}
                  />
                  <span>Custom</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setColor('');
                    setShowColorMenu(false);
                  }}
                  className="text-gray-500 hover:text-red-500 text-[11px] underline"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear Formatting */}
        <ToolbarButton
          title="Clear Formatting (Remove styles & colors)"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting className="w-4 h-4" />
        </ToolbarButton>

        <span className="w-px h-5 bg-gray-200 mx-1" />

        <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editable area */}
      <div className="px-4 py-4 max-h-[520px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
