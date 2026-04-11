import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

const LOG_LEVELS = ['info', 'warn', 'error', 'success'] as const
type LogLevel = (typeof LOG_LEVELS)[number]

interface LogEntry {
  readonly message: string
  readonly level: LogLevel
  readonly timestamp: number
}

const MAX_ENTRIES = 500

const levelColorMap: Readonly<Record<LogLevel, string>> = {
  info: 'var(--rtc-log-info, hsl(210, 80%, 55%))',
  warn: 'var(--rtc-log-warn, hsl(40, 95%, 50%))',
  error: 'var(--rtc-log-error, hsl(0, 75%, 55%))',
  success: 'var(--rtc-log-success, hsl(145, 65%, 42%))',
}

const isValidLevel = (v: string): v is LogLevel =>
  (LOG_LEVELS as readonly string[]).includes(v)

const formatTime = (ts: number): string =>
  new Date(ts).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

@customElement('rtc-log-panel')
export class RtcLogPanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--rtc-log-font, ui-monospace, monospace);
      font-size: 0.75rem;
      background: var(--rtc-log-bg, hsl(0, 0%, 98%));
      color: var(--rtc-log-text, hsl(0, 0%, 15%));
      border: 1px solid var(--rtc-log-border, hsl(0, 0%, 85%));
      border-radius: 0.375rem;
      overflow: hidden;
    }

    @media (prefers-color-scheme: dark) {
      :host {
        background: var(--rtc-log-bg, hsl(0, 0%, 10%));
        color: var(--rtc-log-text, hsl(0, 0%, 88%));
        border-color: var(--rtc-log-border, hsl(0, 0%, 25%));
      }
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.375rem 0.5rem;
      cursor: pointer;
      user-select: none;
      border-block-end: 1px solid var(--rtc-log-border, hsl(0, 0%, 85%));
    }

    @media (prefers-color-scheme: dark) {
      header {
        border-color: var(--rtc-log-border, hsl(0, 0%, 25%));
      }
    }

    header:focus-visible {
      outline: 2px solid var(--rtc-focus-ring, hsl(220, 90%, 56%));
      outline-offset: -2px;
    }

    h3 {
      margin: 0;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    output {
      display: block;
      max-height: 15rem;
      overflow-y: auto;
      padding: 0.25rem;
    }

    output[hidden] {
      display: none;
    }

    p {
      margin: 0;
      padding: 0.125rem 0.25rem;
      display: flex;
      gap: 0.5rem;
      align-items: baseline;
    }

    time {
      flex-shrink: 0;
      opacity: 0.6;
    }

    mark {
      background: none;
      font-weight: 600;
      flex-shrink: 0;
      min-width: 4ch;
    }
  `

  @property({ type: Boolean, reflect: true })
  readonly expanded: boolean = true

  @state()
  private accessor entries: ReadonlyArray<LogEntry> = []

  addEntry(message: string, level: string = 'info'): void {
    const resolved: LogLevel = isValidLevel(level) ? level : 'info'
    const entry: LogEntry = {
      message,
      level: resolved,
      timestamp: Date.now(),
    }
    const next = [...this.entries, entry]
    this.entries =
      next.length > MAX_ENTRIES ? next.slice(-MAX_ENTRIES) : next
    this.updateComplete.then(() => this.scrollToBottom())
  }

  clear(): void {
    this.entries = []
  }

  private scrollToBottom(): void {
    const output = this.shadowRoot?.querySelector('output')
    if (output) {
      output.scrollTop = output.scrollHeight
    }
  }

  private toggleExpanded = (): void => {
    this.dispatchEvent(
      new CustomEvent('rtc-log-toggle', {
        bubbles: true,
        composed: true,
        detail: { expanded: !this.expanded },
      })
    )
    // Allow imperative toggle via attribute
    if (this.hasAttribute('expanded')) {
      this.removeAttribute('expanded')
    } else {
      this.setAttribute('expanded', '')
    }
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.toggleExpanded()
    }
  }

  override render() {
    return html`
      <header
        @click=${this.toggleExpanded}
        @keydown=${this.handleKeydown}
        role="button"
        tabindex="0"
        aria-expanded=${String(this.expanded)}
        aria-controls="log-output"
      >
        <h3>Event Log (${this.entries.length})</h3>
        <span aria-hidden="true">${this.expanded ? '\u25B2' : '\u25BC'}</span>
      </header>
      <output
        id="log-output"
        role="log"
        aria-live="polite"
        ?hidden=${!this.expanded}
      >
        ${this.entries.map(
          entry => html`
            <p>
              <time>${formatTime(entry.timestamp)}</time>
              <mark style="color:${levelColorMap[entry.level]}"
                >${entry.level}</mark
              >
              <span>${entry.message}</span>
            </p>
          `
        )}
      </output>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rtc-log-panel': RtcLogPanel
  }
}
