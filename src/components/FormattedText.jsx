import { Fragment } from 'react';

// Texto con formato mínimo para las descripciones de actividades:
//   - línea en blanco = nuevo párrafo; salto de línea simple = <br>
//   - **negrita** y *cursiva*
// Se arma con nodos de React (sin innerHTML), así que no ejecuta HTML.
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

const renderInline = (text) =>
    text.split(INLINE).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            return <strong key={i} className="font-bold text-gray-800">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={i}>{part}</Fragment>;
    });

const FormattedText = ({ text, className = '' }) => {
    if (!text) return null;
    const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
    return (
        <div className={className}>
            {paragraphs.map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-3' : ''}>
                    {p.split('\n').map((line, j) => (
                        <Fragment key={j}>
                            {j > 0 && <br />}
                            {renderInline(line)}
                        </Fragment>
                    ))}
                </p>
            ))}
        </div>
    );
};

export default FormattedText;
