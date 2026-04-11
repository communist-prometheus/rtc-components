import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type RtcControlEvent =
  | 'rtc-mute-toggle'
  | 'rtc-camera-toggle'
  | 'rtc-screen-toggle'
  | 'rtc-leave'

const fireEvent =
  (host: LitElement, name: RtcControlEvent) => (): void => {
    host.dispatchEvent(
      new CustomEvent(name, { bubbles: true, composed: true })
    )
  }

@customElement('rtc-controls')
export class RtcControls extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--rtc-controls-gap, 0.5rem);
      padding: var(--rtc-controls-padding, 0.5rem);
      font-family: var(--rtc-font-family, system-ui, sans-serif);
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      border: 1px solid var(--rtc-controls-border, hsl(0, 0%, 80%));
      border-radius: var(--rtc-controls-radius, 0.375rem);
      padding: 0.5rem 0.75rem;
      font-family: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      background: var(--rtc-controls-btn-bg, hsl(0, 0%, 100%));
      color: var(--rtc-controls-btn-text, hsl(0, 0%, 15%));
    }

    @media (prefers-color-scheme: dark) {
      button {
        background: var(--rtc-controls-btn-bg, hsl(0, 0%, 18%));
        color: var(--rtc-controls-btn-text, hsl(0, 0%, 90%));
        border-color: var(--rtc-controls-border, hsl(0, 0%, 30%));
      }
    }

    button:hover {
      opacity: 0.85;
    }

    button:focus-visible {
      outline: 2px solid var(--rtc-focus-ring, hsl(220, 90%, 56%));
      outline-offset: 2px;
    }

    button[aria-pressed='true'] {
      background: var(--rtc-controls-active-bg, hsl(0, 75%, 55%));
      color: hsl(0, 0%, 100%);
      border-color: transparent;
    }

    button.leave {
      background: var(--rtc-controls-leave-bg, hsl(0, 75%, 55%));
      color: hsl(0, 0%, 100%);
      border-color: transparent;
    }

    @media (prefers-reduced-motion: no-preference) {
      button {
        transition: background-color 150ms ease, opacity 150ms ease;
      }
    }
  `

  @property({ type: Boolean })
  readonly audioMuted: boolean = false

  @property({ type: Boolean })
  readonly videoMuted: boolean = false

  @property({ type: Boolean })
  readonly screenSharing: boolean = false

  override render() {
    return html`
      <button
        type="button"
        aria-label=${this.audioMuted ? 'Unmute microphone' : 'Mute microphone'}
        aria-pressed=${String(this.audioMuted)}
        @click=${fireEvent(this, 'rtc-mute-toggle')}
      >
        ${this.audioMuted ? 'Unmute' : 'Mute'}
      </button>
      <button
        type="button"
        aria-label=${this.videoMuted ? 'Turn camera on' : 'Turn camera off'}
        aria-pressed=${String(this.videoMuted)}
        @click=${fireEvent(this, 'rtc-camera-toggle')}
      >
        ${this.videoMuted ? 'Camera On' : 'Camera Off'}
      </button>
      <button
        type="button"
        aria-label=${this.screenSharing ? 'Stop sharing screen' : 'Share screen'}
        aria-pressed=${String(this.screenSharing)}
        @click=${fireEvent(this, 'rtc-screen-toggle')}
      >
        ${this.screenSharing ? 'Stop Share' : 'Share'}
      </button>
      <button
        type="button"
        class="leave"
        aria-label="Leave call"
        @click=${fireEvent(this, 'rtc-leave')}
      >
        Leave
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rtc-controls': RtcControls
  }
}
