export const sanitizeColors = (element: HTMLElement) => {
  const treeWalker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_ELEMENT
  );
  do {
    const el = treeWalker.currentNode as HTMLElement;
    const style = el.getAttribute("style");
    if (style && style.includes("oklch")) {
      // Remplacer toutes les occurrences oklch(...) par une couleur de fallback (#000 ici)
      const newStyle = style.replace(/oklch\([^)]*\)/g, "#000");
      el.setAttribute("style", newStyle);
    }
  } while (treeWalker.nextNode());
};

export const sanitizeGlobalStyles = () => {
  const styleSheets = Array.from(document.styleSheets);
  styleSheets.forEach((sheet) => {
    try {
      const rules:any = sheet.cssRules;
      if (!rules) return;
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.style) {
          for (let j = 0; j < rule.style.length; j++) {
            const prop = rule.style[j];
            const val = rule.style.getPropertyValue(prop);
            if (val.includes("oklch")) {
              // Remplacer par noir (ou autre couleur)
              rule.style.setProperty(prop, "#000", "important");
            }
          }
        }
      }
    } catch (e) {
      // Ignorer les erreurs (ex : stylesheets cross-origin)
    }
  });
};
