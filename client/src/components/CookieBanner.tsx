import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CookieBanner() {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show banner only if no consent decision has been made
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setVisible(true);
        }
    }, []);

    const handleAccept = () => {
        if (typeof (window as any).acceptAllCookies === 'function') {
            (window as any).acceptAllCookies();
        }
        setVisible(false);
    };

    const handleReject = () => {
        if (typeof (window as any).rejectCookies === 'function') {
            (window as any).rejectCookies();
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            id="cookie-banner"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                color: 'white',
                padding: '1rem 1.5rem',
                zIndex: 9999,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
            }}
        >
            <p style={{ margin: 0, flex: '1 1 300px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {t('cookies.message')}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                <button
                    onClick={handleReject}
                    style={{
                        padding: '0.6rem 1.2rem',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'transparent',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {t('cookies.reject')}
                </button>
                <button
                    onClick={handleAccept}
                    style={{
                        padding: '0.6rem 1.2rem',
                        border: 'none',
                        background: '#D4AF37',
                        color: 'black',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e6c555'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#D4AF37'}
                >
                    {t('cookies.accept')}
                </button>
            </div>
        </div>
    );
}
