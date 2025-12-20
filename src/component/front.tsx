import { useState, useEffect } from 'react';
import './front.css';

// (0) = tyhjä, (1) = 2x kirjain, (2) = 3x kirjain,
// (3) = 2x sana, (4) = 3x sana, (5) = keskikohta (tyhjä mutta eri design)
const TILE_STYLES = [
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [4, 0, 0, 1, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 4],
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0],
    [1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0, 1],
    [0, 0, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 0, 0],
    [0, 3, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0],
    [4, 0, 0, 1, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 4]
];

const STYLE_MAP: any = {
    0: 'base-tile-empty',
    1: 'base-tile-2x-letter',
    2: 'base-tile-3x-letter',
    3: 'base-tile-2x-word',
    4: 'base-tile-3x-word',
    5: 'base-tile-center'
};

const LBoard = () => {
    const [cursor, setCursor] = useState({ col: 8, row: 8 }); // kursori aluksi keskellä
    const [direction, setDirection] = useState('r'); // 'r' = oikealle (default),  'd' = alas
    const [placedLetters, setPlacedLetters] = useState<Record<string, string>>({});

    const step = 5.36; // laatta (4.96vh) + rako (0.4vh) = 5.36vh

    // kursorin liikutus
    const moveCursorTo = (c: number, r: number) => {
        setCursor({ col: c, row: r });
    };

    const handleCursorClick = () => {
        // This toggles 'r' to 'd' and 'd' back to 'r'
        setDirection((prev) => (prev === 'r' ? 'd' : 'r'));
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { // <- e 
        const key = e.key.toLowerCase();
        const allowedLetters = 'abcdefghijklmnoprstuvwyäö'.split('');

        // NUOLET
        if (e.key === 'ArrowUp') setCursor(prev => ({ ...prev, row: Math.max(1, prev.row - 1) }));
        if (e.key === 'ArrowDown') setCursor(prev => ({ ...prev, row: Math.min(15, prev.row + 1) }));
        if (e.key === 'ArrowLeft') setCursor(prev => ({ ...prev, col: Math.max(1, prev.col - 1) }));
        if (e.key === 'ArrowRight') setCursor(prev => ({ ...prev, col: Math.min(15, prev.col + 1) }));

        // TAB
        if (e.key === 'Tab') {
            e.preventDefault();
            setDirection(prev => (prev === 'r' ? 'd' : 'r'));
        }

        // kirjoitus
        if (allowedLetters.includes(key)) {
            const coordKey = `${cursor.row}-${cursor.col}`;
            
            // Muista kirjaimet
            setPlacedLetters(prev => ({
                ...prev,
                [coordKey]: key.toUpperCase()
            }));

            // liikuta cursoria kirjiamen jälkeen
            setCursor(prev => {
                let newCol = prev.col;
                let newRow = prev.row;
                if (direction === 'r' && newCol < 15) newCol++;
                if (direction === 'd' && newRow < 15) newRow++;
                return { col: newCol, row: newRow };
            });
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [cursor, direction]); // IMPORTANT: Added cursor and direction here

    return (
        <div id='master-div'>
            <div id="base-grid-container" style={{ position: 'relative' }}>
                {TILE_STYLES.map((row, r) => (
                    row.map((cellValue, c) => {
                        const rowNum = r + 1;
                        const colNum = c + 1;
                        const coordKey = `${rowNum}-${colNum}`;
                        const letter = placedLetters[coordKey]; // Check if a letter exists at these coordinates

                        return (
                            <div 
                                key={coordKey} 
                                className={`base-tile ${STYLE_MAP[cellValue]} ${letter ? 'has-letter' : ''}`}
                                onClick={() => moveCursorTo(colNum, rowNum)} // This enables clicking squares!
                                style={{
                                    // If a letter exists in state, show its image
                                    backgroundImage: letter ? `url(/graphics/tiles/letters/${letter}.png)` : undefined,
                                    backgroundSize: 'cover'
                                }}
                            >
                                {/* Visual letters are handled by the backgroundImage style above */}
                            </div>
                        );
                    })
                ))}

                {/* Kursori */}
                <div id="cursor" onClick={handleCursorClick}
                style={{ transform: `translate(${(cursor.col - 1) * step}vh, ${(cursor.row - 1) * step}vh)`,
                        transition: 'transform 0.02s ease-out',
                        zIndex: 10
                }}>
                    <img src="/graphics/tab_tag.svg" id="cursor-tag" className="cursor-inner" alt=""/>
                    <img src="/graphics/cursor_moving.svg" id="cursor-border" className={`cursor-inner ${direction === 'r' ? 'cursor-right' : 'cursor-down'}`} alt="" />
                    <img src="/graphics/cursor_icon.svg" id="cursor-key" className="cursor-inner" alt="" />
                </div>
            </div>

            <div id="hand-container">
                <div id="hand-l-1" className="hand-div"></div>
                <div id="hand-l-2" className="hand-div"></div>
                <div id="hand-l-3" className="hand-div"></div>
                <div id="hand-l-4" className="hand-div hand-div-empty"></div>
                <div id="hand-l-5" className="hand-div"></div>
                <div id="hand-l-6" className="hand-div hand-div-empty"></div>
                <div id="hand-l-7" className="hand-div"></div>
            </div>

        </div>
    );
};

export default LBoard;