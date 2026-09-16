import { FileText, Camera, CalendarDays } from "lucide-react";

export default function MonthlyReports() {
  return <section id="reports" className="container-edge border-t border-line report-section">
    <div>
      <h2 className="section-title">A living report,<br />updated every month.</h2>
      <p className="section-copy mt-6">Monthly photographs and an activity summary document where the partnership actually appears.</p>
    </div>
    <div className="report-preview">
      <div className="report-heading"><span>Monthly documentation</span><span className="status-label">Not started</span></div>
      <h3>The first chapter<br />starts with our partnership.</h3>
      <p>No campaign activity has been recorded yet. This space will hold the real report once the partnership begins.</p>
      <ul className="report-deliverables">
        <li><Camera size={18} strokeWidth={1.5} /><span>Photos from actual appearances</span></li>
        <li><CalendarDays size={18} strokeWidth={1.5} /><span>Meetings, events and locations</span></li>
        <li><FileText size={18} strokeWidth={1.5} /><span>A monthly activity summary</span></li>
      </ul>
    </div>
  </section>;
}
