// Mermaid integration for MkDocs
document.addEventListener('DOMContentLoaded', function() {
    // Load Mermaid from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
    script.onload = function() {
        // Initialize Mermaid with custom theme
        mermaid.initialize({
            startOnLoad: true,
            theme: 'base',
            themeVariables: {
                primaryColor: '#2196f3',
                primaryTextColor: '#333',
                primaryBorderColor: '#1976d2',
                lineColor: '#666',
                sectionBkgColor: '#f5f5f5',
                altSectionBkgColor: '#e3f2fd',
                gridColor: '#ddd',
                secondaryColor: '#fff',
                tertiaryColor: '#f9f9f9',
                background: '#fff',
                secondaryBackground: '#f8f9fa',
                tertiaryBackground: '#fff'
            },
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            },
            sequence: {
                diagramMarginX: 50,
                diagramMarginY: 10,
                actorMargin: 50,
                width: 150,
                height: 65,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35,
                mirrorActors: true,
                bottomMarginAdj: 1,
                useMaxWidth: true,
                rightAngles: false,
                showSequenceNumbers: false
            }
        });
    };
    document.head.appendChild(script);
});
