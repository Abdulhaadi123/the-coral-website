/**
 * The `source` stored on a Lead row says which form it came from. The admin
 * keeps the two kinds apart (separate tabs and dashboard counts), so the writer
 * (/api/contact) and the readers (admin leads page, dashboard) must agree on
 * this exact string — hence one shared constant.
 */

/** Submitted through the "Book a Discovery Call" form (/book-a-call). */
export const DISCOVERY_LEAD_SOURCE = 'book_a_call';

/** Submitted through the portfolio access gate. The default for any other source. */
export const PORTFOLIO_LEAD_SOURCE = 'portfolio_gate';

export const isDiscoveryLead = (lead: { source?: string | null }): boolean =>
  lead.source === DISCOVERY_LEAD_SOURCE;
