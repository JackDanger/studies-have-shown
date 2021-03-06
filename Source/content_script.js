function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = replaceText(textNode.nodeValue);
}

var patterns = [
  /\ba new study finds\b/gi,
  /\ba new study found\b/gi,
  /\bstudies have shown\b/gi,
  /\bA study showed\b/gi,
  /\bstudies showed\b/gi,
  /\ba new study showed\b/gi,
  /\bnew studies showed\b/gi,
]

var replacements = [
  'the archangel Gabriel said'
]

function sampleReplacements() {
  return replacements[Math.floor(Math.random() * replacements.length)];
}

function replaceText(v, replacement)
{

    replacement = sampleReplacements()
    for (var i = patterns.length; i > 0; --i) {
      v = v.replace(patterns[i], replacement)
    }

    return v;
}

// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}

if (typeof document != 'undefined') {
  walkAndObserve(document);
}
// for testing
module.exports = {
  replaceText: replaceText,
  patterns: patterns,
  replacements: replacements,
}
