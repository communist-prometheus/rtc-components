import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const ICE_STATES = [
  'new',
  'checking',
  'connected',
  'completed',
  'disconnected',
  'failed',
  'closed',
] as const

type IceState = (typeof ICE_STATES)[number]

const stateColorMap: Readonly<Record<IceState, string>> = {
  new: 'var(--rtc-status-new, hsl(210, 15%, 60%))',
  checking: 'var(--rtc-status-checking, hsl(45, 95%, 50%))',
  connected: 'var(--rtc-status-connected, hsl(145, 65%, 42%))',
  completed: 'var(--rtc-status-completed, hsl(145, 65%, 42%))',
  disconnected: 'var(--rtc-status-disconnected, hsl(45, 95%, 50%))',
  failed: 'var(--rtc-status-failed, hsl(0, 75%, 55%))',
  closed: 'var(--rtc-status-closed, hsl(210, 15%, 60%))',
}

const stateLabel: Readonly<Record<IceState, string>> = {
  new: 'New',
  checking: 'Checking',
  connected: 'Connected',
  completed: 'Completed',
  disconnected: 'Disconnected',
  failed: 'Failed',
  closed: 'Closed',
}

const isValidIceState = (value: string): value is IceState =>
  (ICE_STATES as readonly string[]).includes(value)

@customElement('rtc-connection-status')
export class RtcConnectionStatus extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--rtc-font-family, system-ui, sans-serif);
      font-size: var(--rtc-status-font-size, 0.8125rem);
    }

    span[role='status'] {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.1875rem 0.5rem;
      border-radius: 624.9375rem;
      background: var(--rtc-status-bg, hsl(0, 0%, 95%));
      color: var(--rtc-status-text, hsl(0, 0%, 20%));
    }

    @media (prefers-color-scheme: dark) {
      span[role='status'] {
        background: var(--rtc-status-bg, hsl(0, 0%, 18%));
        color: var(--rtc-status-text, hsl(0, 0%, 88%));
      }
    }

    i {
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      flex-shrink: 0;
    }

    @media (prefers-reduced-motion: no-preference) {
      i {
        transition: background-color 200ms ease;
      }
    }
  `

  @property({ type: String })
  readonly state: string = 'new'

  private get resolvedState(): IceState {
    return isValidIceState(this.state) ? this.state : 'new'
  }

  override render() {
    const resolved = this.resolvedState
    return html`
      <span role="status" aria-label="Connection: ${stateLabel[resolved]}">
        <i style="background:${stateColorMap[resolved]}"></i>
        ${stateLabel[resolved]}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rtc-connection-status': RtcConnectionStatus
  }
}
