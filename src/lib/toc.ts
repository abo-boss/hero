import GithubSlugger from 'github-slugger'

export type TocItem = {
  text: string
  id: string
  level: number
}

export function getTableOfContents(content: string): TocItem[] {
  const slugger = new GithubSlugger()
  // Match standard markdown headings
  // Matches # Heading 1, ## Heading 2, etc.
  // Using multiline flag 'm'
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TocItem[] = []
  
  // Clone the regex for matchAll to work correctly if needed or use matchAll directly on string
  const matches = Array.from(content.matchAll(headingRegex))
  
  matches.forEach((match) => {
    const level = match[1].length
    const text = match[2].trim()
    const id = slugger.slug(text)
    
    // Only include h2 and h3
    if (level >= 2 && level <= 3) {
      toc.push({ text, id, level })
    }
  })
  
  return toc
}
