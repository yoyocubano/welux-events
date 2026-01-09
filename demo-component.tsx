import React, { useState } from 'react';

/**
 * Demo Component para mostrar las capacidades de Continue + VS Code
 * 
 * INSTRUCCIONES PARA CONTINUE:
 * 1. Selecciona este componente completo
 * 2. Presiona Cmd+L (abrir Continue)
 * 3. Escribe: "Mejora este componente añadiendo:
 *    - Tipos TypeScript estrictos
 *    - Manejo de errores
 *    - Accesibilidad WCAG 2.1
 *    - Documentación JSDoc completa"
 */

// TODO: Continue puede mejorar esto automáticamente
export const DemoComponent = () => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted:', name);
    };

    return (
        <div>
            <h1>Welux Events Demo</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
