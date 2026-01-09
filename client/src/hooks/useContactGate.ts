import { useState, useEffect } from 'react';

export function useContactGate() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        // Check local storage on mount
        const unlocked = localStorage.getItem('welux_contact_unlocked') === 'true';
        setIsUnlocked(unlocked);
    }, []);

    const unlock = () => {
        localStorage.setItem('welux_contact_unlocked', 'true');
        setIsUnlocked(true);
    };

    return { isUnlocked, unlock };
}
