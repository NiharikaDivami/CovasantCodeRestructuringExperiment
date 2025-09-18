export const styles = {
  sheetContent: {
    width: 1200,
    maxWidth: '95vw',
    padding: 0,
    gap: 0,
    overflow: 'hidden',
    marginTop: 80,
  } as React.CSSProperties,
  container: {
    display: 'flex',
    height: 'calc(100vh - 120px)',
    overflow: 'hidden',
    maxWidth: '100%',
  } as React.CSSProperties,
  leftPanel: {
    width: 288,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column' as const,
    flexShrink: 0,
    overflow: 'hidden',
  },
  leftHeader: {
    padding: 16,
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  } as React.CSSProperties,
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  } as React.CSSProperties,
  docHeader: {
    padding: '12px 24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  } as React.CSSProperties,
  contentWrapper: {
    height: '100%',
  } as React.CSSProperties,
  pageCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 24,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  } as React.CSSProperties,
  highlighted: {
    backgroundColor: '#fef3c7',
    padding: '2px 8px',
    borderRadius: 4,
    fontWeight: 500,
    border: '1px solid #fde68a',
  } as React.CSSProperties,
};
