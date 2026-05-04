import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  BROWSER_SETTINGS_EVENT,
  loadOpenLinksInApp,
  saveOpenLinksInApp,
} from "@/lib/browser-settings"

const AUTO_SUGGEST_KEY = "editor-auto-suggest"

function getAutoSuggest(): boolean {
  if (typeof window === "undefined") return true
  const stored = localStorage.getItem(AUTO_SUGGEST_KEY)
  if (stored === null) return true
  return stored === "true"
}

function setAutoSuggest(enabled: boolean) {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTO_SUGGEST_KEY, String(enabled))
}

export const EditorSettingsPanel = React.memo(function EditorSettingsPanel() {
  const [autoSuggest, setAutoSuggestState] = React.useState(() => getAutoSuggest())
  const [openLinksInApp, setOpenLinksInApp] = React.useState<boolean>(() =>
    loadOpenLinksInApp(),
  )

  React.useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ openLinksInApp?: boolean }>).detail
      if (typeof detail?.openLinksInApp === "boolean") {
        setOpenLinksInApp(detail.openLinksInApp)
      }
    }

    window.addEventListener(BROWSER_SETTINGS_EVENT, handleChange)
    return () => window.removeEventListener(BROWSER_SETTINGS_EVENT, handleChange)
  }, [])

  const handleAutoSuggestChange = React.useCallback((value: string) => {
    if (value === "on" || value === "off") {
      const enabled = value === "on"
      setAutoSuggestState(enabled)
      setAutoSuggest(enabled)
    }
  }, [])

  const handleBrowserToggle = React.useCallback((next: boolean) => {
    setOpenLinksInApp(next)
    saveOpenLinksInApp(next)
  }, [])

  return (
    <section className="rounded-xl border border-border/60 bg-card px-4 py-4 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground/85">Editor</h2>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Configure editor behavior, assistive features, and link handling.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Auto Suggestions
          </label>
          <p className="mt-1 text-xs text-muted-foreground">
            {autoSuggest
              ? "Ghost text completions will appear as you type to help finish your sentences."
              : "Auto suggestions are disabled. You can still trigger them manually with Ctrl+Space."}
          </p>
          <ToggleGroup
            type="single"
            variant="outline"
            className="mt-2 w-fit rounded-lg"
            value={autoSuggest ? "on" : "off"}
            onValueChange={handleAutoSuggestChange}
          >
            <ToggleGroupItem value="on" className="gap-1.5 rounded-l-lg rounded-r-none px-4">
              Enabled
            </ToggleGroupItem>
            <ToggleGroupItem value="off" className="gap-1.5 rounded-l-none rounded-r-lg px-4">
              Disabled
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Browser
          </label>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Control how external links from the editor are opened.
          </p>
          <label className="mt-2 flex cursor-pointer items-start justify-between gap-4 rounded-md bg-muted/50 px-3 py-2">
            <span className="min-w-0">
              <span className="block text-xs font-medium text-foreground">
                Open links in in-app browser
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Links clicked in notes open in a new tab with an embedded browser.
                When off, links open in your system browser.
              </span>
            </span>
            <Switch
              checked={openLinksInApp}
              onCheckedChange={handleBrowserToggle}
              aria-label="Open links in in-app browser"
            />
          </label>
        </div>
      </div>
    </section>
  )
})
