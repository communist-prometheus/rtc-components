import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

const columnCount = (children: number): number => {
  if (children <= 1) return 1
  if (children <= 4) return 2
  return 3
}

@customElement('rtc-video-grid')
export class RtcVideoGrid extends LitElement {
  static override styles = css`
    :host {
      display: grid;
      gap: var(--rtc-grid-gap, 0.5rem);
      width: 100%;
      height: 100%;
    }
  `

  @state()
  private accessor columns = 1

  private readonly observer = new MutationObserver(() =>
    this.updateColumns()
  )

  override connectedCallback() {
    super.connectedCallback()
    this.observer.observe(this, { childList: true })
    this.updateColumns()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this.observer.disconnect()
  }

  private updateColumns(): void {
    const count = this.children.length
    this.columns = columnCount(count)
    this.style.setProperty(
      'grid-template-columns',
      `repeat(${this.columns}, 1fr)`
    )
  }

  override render() {
    return html`<slot @slotchange=${this.updateColumns}></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'rtc-video-grid': RtcVideoGrid
  }
}
