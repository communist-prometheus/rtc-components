import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../connection-status/rtc-connection-status.js'

@customElement('rtc-video-tile')
export class RtcVideoTile extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      border-radius: var(--rtc-tile-radius, 0.5rem);
      background: var(--rtc-tile-bg, hsl(0, 0%, 10%));
      aspect-ratio: 16 / 9;
    }

    video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    footer {
      position: absolute;
      inset-inline: 0;
      inset-block-end: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.375rem 0.5rem;
      background: linear-gradient(transparent, hsl(0, 0%, 0%, 0.6));
      color: hsl(0, 0%, 100%);
      font-family: var(--rtc-font-family, system-ui, sans-serif);
      font-size: 0.8125rem;
    }

    label {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: no-preference) {
      :host {
        transition: box-shadow 200ms ease;
      }
    }
  `

  @property({ attribute: false })
  readonly stream: MediaStream | undefined = undefined

  @property({ type: String, reflect: true })
  readonly userId: string = ''

  @property({ type: Boolean })
  readonly muted: boolean = false

  @property({ type: String })
  readonly label: string = ''

  @property({ type: String })
  readonly connectionState: string = 'new'

  override updated(changed: Map<string, unknown>) {
    if (changed.has('stream') || changed.has('muted')) {
      this.syncVideo()
    }
  }

  private syncVideo(): void {
    const video = this.shadowRoot?.querySelector('video')
    if (!video) return
    video.srcObject = this.stream ?? null
    video.muted = this.muted
  }

  override render() {
    return html`
      <video
        autoplay
        playsinline
        ?muted=${this.muted}
        aria-label="Video feed for ${this.label || this.userId}"
      ></video>
      <footer>
        <label>${this.label || this.userId}</label>
        <rtc-connection-status
          .state=${this.connectionState}
        ></rtc-connection-status>
      </footer>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rtc-video-tile': RtcVideoTile
  }
}
