import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Minus,
  Type,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  children,
  title
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "h-8 w-8 p-0 hover:bg-primary/10",
      isActive && "bg-primary/20 text-primary"
    )}
  >
    {children}
  </Button>
);

const Divider = () => (
  <div className="w-px h-6 bg-border mx-1" />
);

export function RichTextEditor({ content, onChange, placeholder = "Escribe el contenido..." }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const isInternalChange = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto my-4',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
    ],
    content,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Sincronizar contenido externo (solo cuando viene de fuera, no del editor)
  useEffect(() => {
    if (editor && !isInternalChange.current) {
      const currentContent = editor.getHTML();
      if (content !== currentContent) {
        editor.commands.setContent(content || '');
      }
    }
    isInternalChange.current = false;
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkUrl('');
    setLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;
    
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setImagePopoverOpen(false);
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  const colors = [
    { name: 'Negro', value: '#000000' },
    { name: 'Gris', value: '#6B7280' },
    { name: 'Rojo', value: '#DC2626' },
    { name: 'Naranja', value: '#EA580C' },
    { name: 'Amarillo', value: '#CA8A04' },
    { name: 'Verde', value: '#16A34A' },
    { name: 'Azul', value: '#2563EB' },
    { name: 'Morado', value: '#9333EA' },
    { name: 'Rosa', value: '#DB2777' },
  ];

  const highlightColors = [
    { name: 'Amarillo', value: '#FEF08A' },
    { name: 'Verde', value: '#BBF7D0' },
    { name: 'Azul', value: '#BFDBFE' },
    { name: 'Rosa', value: '#FBCFE8' },
    { name: 'Naranja', value: '#FED7AA' },
  ];

  return (
    <div className="border rounded-xl overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 items-center">
        {/* Undo/Redo */}
        <MenuButton 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Deshacer"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Rehacer"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Headings */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Párrafo"
        >
          <Type className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Basic formatting */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Negrita"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Cursiva"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Subrayado"
        >
          <UnderlineIcon className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Color de texto"
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1 flex-wrap max-w-[180px]">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => editor.chain().focus().setColor(color.value).run()}
                  className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetColor().run()}
                className="w-6 h-6 rounded border hover:scale-110 transition-transform flex items-center justify-center text-xs"
                title="Quitar color"
              >
                ✕
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Highlight */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Resaltar"
              className={cn(
                "h-8 w-8 p-0 hover:bg-primary/10",
                editor.isActive('highlight') && "bg-primary/20"
              )}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1">
              {highlightColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => editor.chain().focus().toggleHighlight({ color: color.value }).run()}
                  className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                className="w-6 h-6 rounded border hover:scale-110 transition-transform flex items-center justify-center text-xs"
                title="Quitar resaltado"
              >
                ✕
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Divider />

        {/* Alignment */}
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Alinear izquierda"
        >
          <AlignLeft className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Centrar"
        >
          <AlignCenter className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Alinear derecha"
        >
          <AlignRight className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justificar"
        >
          <AlignJustify className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Lists */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Quote & Code */}
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Bloque de código"
        >
          <Code className="h-4 w-4" />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Línea horizontal"
        >
          <Minus className="h-4 w-4" />
        </MenuButton>

        <Divider />

        {/* Link */}
        <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Insertar enlace"
              className={cn(
                "h-8 w-8 p-0 hover:bg-primary/10",
                editor.isActive('link') && "bg-primary/20 text-primary"
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <Label>URL del enlace</Label>
              <Input
                placeholder="https://ejemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setLink();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={setLink}>
                  Insertar
                </Button>
                {editor.isActive('link') && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      editor.chain().focus().unsetLink().run();
                      setLinkPopoverOpen(false);
                    }}
                  >
                    Quitar enlace
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Image */}
        <Popover open={imagePopoverOpen} onOpenChange={setImagePopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Insertar imagen"
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-3">
              <Label>URL de la imagen</Label>
              <Input
                placeholder="https://ejemplo.com/imagen.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <Button size="sm" onClick={addImage}>
                Insertar imagen
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Character count */}
      <div className="border-t px-4 py-2 text-xs text-muted-foreground flex justify-between">
        <span>
          {editor.storage.characterCount?.characters?.() || editor.getText().length} caracteres
        </span>
        <span>
          ~{Math.max(1, Math.ceil((editor.getText().length) / 200))} min de lectura
        </span>
      </div>
    </div>
  );
}

export default RichTextEditor;
